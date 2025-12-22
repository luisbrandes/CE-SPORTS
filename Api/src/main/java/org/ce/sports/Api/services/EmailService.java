package org.ce.sports.Api.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ce.sports.Api.entities.NotificationPreference;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.NotificationPreferenceRepository;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final UserRepository userRepository;
    private final NotificationPreferenceRepository prefRepository;
    private final JavaMailSender mailSender;

    // ---------------------------
    // CÓDIGO DE VERIFICAÇÃO
    // ---------------------------
    public void enviarCodigoVerificacao(String destinatario, String codigo) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("Verifique seu e-mail - CE Sports");

            String html = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a;
                            color: #f8fafc; padding: 30px; border-radius: 12px;
                            max-width: 480px; margin: auto; text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <h2 style="color: #38bdf8; margin: 0;">🏋️‍♂️ CE Sports</h2>
                        <p style="font-size: 14px; color: #cbd5e1;">Centro Esportivo CEFET-MG</p>
                    </div>
                    <div style="background-color: #1e293b; border-radius: 10px; padding: 20px;">
                        <p style="font-size: 28px; font-weight: bold; color: #38bdf8;">%s</p>
                    </div>
                </div>
                """.formatted(codigo);

            helper.setText(html, true);
            mailSender.send(mensagem);

        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar e-mail: " + e.getMessage(), e);
        }
    }

    // ---------------------------
    // RESET DE SENHA
    // ---------------------------
    public void sendResetPasswordEmail(String destinatario, String resetLink) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("Redefinição de Senha - CE Sports");

            String html = """
                <div style="font-family:'Segoe UI', Arial; background-color:#0f172a;
                            color:#f8fafc; padding:30px; border-radius:12px;
                            max-width:480px; margin:auto; text-align:center;">
                    <h2 style="color:#38bdf8;">🏋️‍♂️ CE Sports</h2>
                    <p style="color:#cbd5e1;">Clique abaixo para redefinir sua senha.</p>
                    <a href="%s" style="padding:12px 20px; background:#38bdf8; color:#0f172a;
                                       border-radius:8px; text-decoration:none; font-weight:bold;">
                        Redefinir Senha
                    </a>
                </div>
                """.formatted(resetLink);

            helper.setText(html, true);
            mailSender.send(msg);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar email: " + e.getMessage(), e);
        }
    }

    // ---------------------------
    // NOTIFICAÇÕES GERAIS
    // ---------------------------
    public void enviarNotificacao(String titulo, String conteudo) {

        List<User> usuarios = userRepository.findAll();

        for (User user : usuarios) {

            // 1) Preferência no próprio usuário (boolean, nunca null)
            boolean receberUsuario = user.isReceberNotificacoes();

            // 2) Preferência específica (NotificationPreference)
            boolean receberPref = prefRepository.findById(user.getId())
                    .map(NotificationPreference::isReceiveNews)
                    .orElse(true);

            // Se qualquer uma negar, não envia
            if (!receberUsuario || !receberPref) {
                continue;
            }

            try {
                MimeMessage msg = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

                helper.setTo(user.getEmail());
                helper.setSubject(titulo);

                String html = """
                    <div style="font-family:'Segoe UI',Arial;background:#0f172a;color:#f8fafc;
                                padding:30px;border-radius:12px;max-width:520px;margin:auto;">
                        <h2 style="color:#38bdf8;">🏋️‍♂️ CE Sports</h2>
                        <div style="background:#1e293b;border-radius:10px;padding:20px;margin-top:20px;">
                            <h3 style="color:#f1f5f9;margin-bottom:10px;">%s</h3>
                            <p style="color:#cbd5e1;">%s</p>
                        </div>
                        <p style="font-size:12px;color:#64748b;margin-top:20px;">
                            Para desativar notificações, acesse:
                            <a style="color:#38bdf8;" href="http://localhost:3000/noticias">
                                página de notícias
                            </a>
                        </p>
                    </div>
                """.formatted(titulo, conteudo);

                helper.setText(html, true);
                mailSender.send(msg);

                log.info("Notificação enviada para {}", user.getEmail());

            } catch (Exception e) {
                log.error("Erro ao enviar email para {}: {}", user.getEmail(), e.getMessage(), e);
            }
        }
    }
}
