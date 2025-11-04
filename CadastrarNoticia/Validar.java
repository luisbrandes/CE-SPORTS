package CadastrarNoticia;
import java.time.LocalDateTime;

public class Validar {
    private final RepositorioNoticia repo = new RepositorioNoticia();

    public Noticia cadastrar(Usuario usuario, NovaNoticia noticia) {
        if (usuario.getPapel() == Papel.VISITANTE) {
            throw new AcessoNegadoException("Visitante não pode cadastrar notícias.");
        }

        if (noticia.getTitulo() == null || noticia.getTitulo().isBlank()) {
            throw new ValidacaoException("Um título é obrigatório.");
        }
        if (noticia.getConteudo() == null || noticia.getConteudo().isBlank()) {
            throw new ValidacaoException("Conteúdo é obrigatório.");
        }
        if (noticia.getEsporte() == null || noticia.getEsporte().isBlank()) {
            throw new ValidacaoException("Esporte da notícia é obrigatório.");
        }

        Noticia not = new Noticia(
                null,
                noticia.getTitulo().trim(),
                noticia.getConteudo().trim(),
                noticia.getEsporte().trim(),
                usuario.getId(),
                usuario.getNome(),
                LocalDateTime.now()
        );
        return repo.salvar(not);
    }

    public java.util.List<Noticia> listar() {
        return repo.listar();
    }
}
