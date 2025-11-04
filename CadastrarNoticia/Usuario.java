package CadastrarNoticia;
import java.time.LocalDateTime;
import java.util.Objects;

final class Usuario {
    private final Long id;
    private final String nome;
    private final Papel papel;

    public Usuario(Long id, String nome, Papel papel) {
        this.id = Objects.requireNonNull(id);
        this.nome = Objects.requireNonNull(nome);
        this.papel = Objects.requireNonNull(papel);
    }
    public Long getId() {
        return id;
    }
    public String getNome() {
        return nome;
    }
    public Papel getPapel() {
        return papel;
    }
}
