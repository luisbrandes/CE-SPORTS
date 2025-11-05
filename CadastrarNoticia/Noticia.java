package CadastrarNoticia;
import java.time.LocalDateTime;
import java.util.Objects;

final class Noticia {
    private Long id;
    private final String titulo;
    private final String conteudo;
    private final String esporte;
    private final Long autorId;
    private final String autorNome;
    private final LocalDateTime criadaEm;

    public Noticia(Long id, String titulo, String conteudo, String esporte,
                   Long autorId, String autorNome, LocalDateTime criadaEm) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.esporte = esporte;
        this.autorId = autorId;
        this.autorNome = autorNome;
        this.criadaEm = criadaEm;
    }

    public Long getId() {
        return id;
    }
    public String getTitulo(){
        return titulo;
    }
    public String getConteudo(){
        return conteudo;
    }
    public String getEsporte(){
        return esporte;
    }
    public Long getAutorId(){
        return autorId;
    }
    public String getAutorNome(){
        return autorNome;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override public String toString() {
        return String.format("Noticia{id=%d, titulo='%s', esporte='%s', autor='%s', criadaEm=%s}", id, titulo, esporte, autorNome, criadaEm);
    }

}
