package org.ce.sports.Api.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.entities.User;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public void enviarCodigoVerificacao(String destinatario, String codigo) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true);
            helper.setTo(destinatario);
            helper.setSubject("Verifique seu e-mail - CE Sports");

            String html = String.format("""
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; 
                            color: #f8fafc; padding: 30px; border-radius: 12px; 
                            max-width: 480px; margin: auto; text-align: center;">
                    
                    <div style="margin-bottom: 20px;">
                        <h2 style="color: #38bdf8; margin: 0;">🏋️‍♂️ CE Sports</h2>
                        <p style="font-size: 14px; color: #cbd5e1;">Centro Esportivo CEFET-MG</p>
                    </div>

                    <div style="background-color: #1e293b; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="margin: 0; color: #f1f5f9;">Bem-vindo(a)!</h3>
                        <p style="font-size: 15px; color: #cbd5e1; margin-top: 8px;">
                            Aqui está seu código de verificação:
                        </p>
                        <p style="font-size: 28px; font-weight: bold; color: #38bdf8; margin: 15px 0;">
                            %s
                        </p>
                        <p style="font-size: 14px; color: #94a3b8;">
                            Use este código para confirmar seu cadastro no CE Sports.
                        </p>
                    </div>

                    <a href="http://localhost:3000/register/verify"
                       style="display: inline-block; padding: 12px 20px; background-color: #38bdf8; 
                              color: #0f172a; text-decoration: none; font-weight: bold; 
                              border-radius: 8px; font-size: 15px;">
                        Confirmar Cadastro
                    </a>

                    <p style="font-size: 12px; color: #64748b; margin-top: 25px;">
                        Caso não tenha solicitado este e-mail, apenas ignore.
                    </p>
                </div>
                """, codigo);

            helper.setText(html, true);
            mailSender.send(mensagem);
        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

    public void sendResetPasswordEmail(String destinatario, String resetLink) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject("Redefinição de Senha - CE Sports");

            String html = """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; 
                        color: #f8fafc; padding: 30px; border-radius: 12px; 
                        max-width: 480px; margin: auto; text-align: center;">

                <div style="margin-bottom: 20px;">
                    <h2 style="color: #38bdf8; margin: 0;">🏋️‍♂️ CE Sports</h2>
                    <p style="font-size: 14px; color: #cbd5e1;">Centro Esportivo CEFET-MG</p>
                </div>

                <div style="background-color: #1e293b; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                    <h3 style="margin: 0; color: #f1f5f9;">Recuperação de Senha</h3>
                    <p style="font-size: 15px; color: #cbd5e1; margin-top: 8px;">
                        Recebemos uma solicitação para redefinir sua senha.
                    </p>
                    <p style="font-size: 14px; color: #94a3b8; margin-top: 12px;">
                        Caso não tenha sido você, apenas ignore este e-mail.
                    </p>
                </div>

                <a href="%s"
                   style="display: inline-block; padding: 12px 20px; background-color: #38bdf8; 
                          color: #0f172a; text-decoration: none; font-weight: bold; 
                          border-radius: 8px; font-size: 15px;">
                    Redefinir Senha
                </a>

                <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
                    Este link é válido por apenas 1 hora.
                </p>
            </div>
            """.formatted(resetLink);

            helper.setText(html, true);
            mailSender.send(mensagem);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail de recuperação de senha: " + e.getMessage());
        }
    }


    public void enviarNotificacao(String titulo, String conteudo) {
        List<User> Usuarios = userRepository.findAll();
        for (User user : Usuarios) {
            try {
                MimeMessage mensagem = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mensagem, true);
                helper.setSubject(titulo);
                helper.setTo(user.getEmail());
                String html = String.format("""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; 
                color: #f8fafc; padding: 30px; border-radius: 12px; 
                max-width: 520px; margin: auto; text-align: center;">

        <div style="margin-bottom: 20px;">
            <h2 style="color: #38bdf8; margin: 0;">🏋️‍♂️ CE Sports</h2>
            <p style="font-size: 14px; color: #cbd5e1;">Centro Esportivo CEFET-MG</p>
        </div>

        <div style="background-color: #1e293b; border-radius: 10px; 
                    padding: 20px; margin-bottom: 25px; text-align: left;">
            
   

            <p style="font-size: 15px; color: #cbd5e1; margin-top: 12px; line-height: 1.6;">
                %s
            </p>
        </div>

        <p style="font-size: 12px; color: #64748b; margin-top: 25px;">
            Esta é uma mensagem automática do sistema CE Sports. Por favor, não responda este e-mail.
        </p>
    </div>
    """, conteudo);


                helper.setText(html, true);
                mailSender.send(mensagem);
            } catch (MessagingException e) {
                throw new RuntimeException("Erro ao enviar e-mail: " + e.getMessage());
            }
    }
    }
}
