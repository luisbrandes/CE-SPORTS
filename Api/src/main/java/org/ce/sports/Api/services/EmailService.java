package org.ce.sports.Api.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void enviarCodigoVerificacao(String destinatario, String codigo) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true);
            helper.setTo(destinatario);
            helper.setSubject("Verifique seu e-mail - CE Sports");
            helper.setText(
                    "<h3>Bem-vindo ao CE Sports!</h3>" +
                            "<p>Seu código de verificação é: <b>" + codigo + "</b></p>" +
                            "<p>Use este código para confirmar seu cadastro.</p>",
                    true
            );
            mailSender.send(mensagem);
        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar e-mail: " + e.getMessage());
        }
    }
}
