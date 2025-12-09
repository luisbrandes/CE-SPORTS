package org.ce.sports.Api.enums;

public enum ModalidadeEnum {
    FUTEBOL("Futebol"),
    BASQUETE("Basquete"),
    HANDEBOL("Handebol"),
    VOLEI("Vôlei");

    private final String descricao;

    ModalidadeEnum(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}