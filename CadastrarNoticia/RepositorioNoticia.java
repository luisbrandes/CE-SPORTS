package CadastrarNoticia;
import java.util.ArrayList;
import java.util.List;

public class RepositorioNoticia {
    private long proximoId = 1;
    private final List<Noticia> banco = new ArrayList<>();

    public Noticia salvar(Noticia noticia) {
        noticia.setId(proximoId++);
        banco.add(noticia);
        return noticia;
    }

    public List<Noticia> listar() {
        return banco;
    }
}
