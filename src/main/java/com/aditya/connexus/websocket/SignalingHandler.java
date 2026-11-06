package com.aditya.connexus.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebRTC signaling relay. The server never touches media: it only forwards call-setup messages
 * (call-request, call-accept, call-reject, offer, answer, ice-candidate, hang-up) between two users.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SignalingHandler extends TextWebSocketHandler {

    private static final Set<String> RELAYED_TYPES = Set.of(
            "call-request", "call-accept", "call-reject", "offer", "answer", "ice-candidate", "hang-up");
    private static final int SEND_TIME_LIMIT_MS = 10_000;
    private static final int BUFFER_SIZE_LIMIT = 256 * 1024;

    private final ObjectMapper mapper;

    // email -> that user's (thread-safe wrapped) session. One live connection per user.
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String email = emailOf(session);
        WebSocketSession safe = new ConcurrentWebSocketSessionDecorator(
                session, SEND_TIME_LIMIT_MS, BUFFER_SIZE_LIMIT);

        WebSocketSession previous = sessions.put(email, safe);
        if (previous != null) {
            try {
                previous.close(CloseStatus.POLICY_VIOLATION.withReason("Connected from another location"));
            } catch (IOException e) {
                log.debug("Failed to close previous session for {}", email);
            }
        }
        log.info("Signaling connected: {} (online: {})", email, sessions.size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        String from = emailOf(session);

        JsonNode in;
        try {
            in = mapper.readTree(message.getPayload());
        } catch (JsonProcessingException e) {
            sendError(session, "Invalid JSON");
            return;
        }

        String type = in.path("type").asText("");
        String to = in.path("to").asText("").trim().toLowerCase(Locale.ROOT);

        if (!RELAYED_TYPES.contains(type) || to.isEmpty() || to.equals(from)) {
            sendError(session, "Invalid message");
            return;
        }

        WebSocketSession target = sessions.get(to);
        if (target == null || !target.isOpen()) {
            ObjectNode unavailable = mapper.createObjectNode();
            unavailable.put("type", "peer-unavailable");
            unavailable.put("from", to);
            send(senderSession(session), unavailable);
            return;
        }

        ObjectNode out = mapper.createObjectNode();
        out.put("type", type);
        out.put("from", from); // taken from the verified JWT, never from the client, so it can't be spoofed
        if (in.has("callType")) {
            out.put("callType", "audio".equals(in.get("callType").asText()) ? "audio" : "video");
        }
        if (in.has("data")) {
            out.set("data", in.get("data"));
        }
        send(target, out);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String email = emailOf(session);
        // Only remove the entry if it still belongs to this session (it may have been replaced)
        sessions.computeIfPresent(email, (k, current) -> current.getId().equals(session.getId()) ? null : current);
        log.info("Signaling disconnected: {} (online: {})", email, sessions.size());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.debug("Transport error for {}: {}", emailOf(session), exception.getMessage());
        session.close(CloseStatus.SERVER_ERROR);
    }

    private String emailOf(WebSocketSession session) {
        return (String) session.getAttributes().get(JwtHandshakeInterceptor.EMAIL_ATTR);
    }

    // Prefer the thread-safe decorated session when replying to the sender
    private WebSocketSession senderSession(WebSocketSession raw) {
        WebSocketSession registered = sessions.get(emailOf(raw));
        return (registered != null && registered.getId().equals(raw.getId())) ? registered : raw;
    }

    private void sendError(WebSocketSession session, String message) {
        ObjectNode error = mapper.createObjectNode();
        error.put("type", "error");
        error.put("message", message);
        send(senderSession(session), error);
    }

    private void send(WebSocketSession target, ObjectNode payload) {
        try {
            target.sendMessage(new TextMessage(payload.toString()));
        } catch (IOException | RuntimeException e) {
            log.debug("Failed to send signaling message: {}", e.getMessage());
        }
    }
}