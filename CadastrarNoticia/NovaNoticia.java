package CadastrarNoticia;

final class NovaNoticia {
    private final String titulo;
    private final String conteudo;
    private final String esporte;

    public NovaNoticia(String titulo, String conteudo, String esporte) {
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.esporte = esporte;
    }
    public String getTitulo() {
        return titulo;
    }
    public String getConteudo() {
        return conteudo;
    }
    public String getEsporte() {
        return esporte;
    }
}



