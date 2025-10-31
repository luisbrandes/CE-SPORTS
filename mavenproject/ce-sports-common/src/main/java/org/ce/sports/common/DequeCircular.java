package org.ce.sports.common;

public class DequeCircular<T> {
    private T[] dados;
    private int inicio, fim, tamanho;

    public DequeCircular(Class<T> clazz) {
        @SuppressWarnings("unchecked")
        T[] dados = (T[]) java.lang.reflect.Array.newInstance(clazz, 10);
        this.dados = dados;
        this.inicio = 0;
        this.fim = 0;
        this.tamanho = 0;
    }

    private void realloc() {
        @SuppressWarnings("unchecked")
        T[] newDados = (T[]) new Object[tamanho + 10];

        for(int i = 0; i < tamanho; i++){
            newDados[i] = dados[i];
        }

        dados = newDados;
    }

    public void inserirNoInicio(T item) {
        if (tamanho == dados.length) {
            realloc();
        }

        inicio = (inicio - 1 + dados.length) % dados.length;
        dados[inicio] = item;
        tamanho++;
    }

    public void inserirNoFim(T item) {
        if (tamanho == dados.length) {
            realloc();
        }

        dados[fim] = item;
        fim = (fim + 1) % dados.length;
        tamanho++;
    }

    public T removerPrimeiro() {
        if (estaVazia()) {
            throw new DequeVazioException();
        }

        T valor = dados[inicio];
        inicio = (inicio + 1) % dados.length;
        tamanho--;
        return valor;
    }

    public T removerUltimo() {
        if (estaVazia()) {
            throw new DequeVazioException();
        }

        fim = (fim - 1 + dados.length) % dados.length;
        T valor = dados[fim];
        tamanho--;
        return valor;
    }

    public T obterPrimeiro() {
        if (estaVazia()) {
            throw new DequeVazioException();
        }

        return dados[inicio];
    }

    public T obterUltimo() {
        if (estaVazia()) {
            throw new DequeVazioException();
        }

        int pos = (fim - 1 + dados.length) % dados.length;
        return dados[pos];
    }

    public T[] getArrayElementos(Class<T> clazz) {
        if (estaVazia()) {
            throw new DequeVazioException();
        }

        @SuppressWarnings("unchecked")
        T[] elementos = (T[]) java.lang.reflect.Array.newInstance(clazz, tamanho);
        
        for (int i = 0; i < tamanho; i++) {
            int index = (inicio + i) % this.dados.length;
            elementos[i] = this.dados[index];
        }
        
        return elementos;
    }

    public boolean estaVazia() {
        return tamanho == 0;
    }

    public int tamanho() {
        return tamanho;
    }
}