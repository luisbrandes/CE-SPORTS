package org.ce.sports.common;

<<<<<<< HEAD
<<<<<<< HEAD
import java.util.Iterator;
import java.util.NoSuchElementException;

public class DequeCircular<T> implements Iterable<T> {
	private T[] dados;
	private int capacidade;
	private int inicio;
	private int fim;
	private int tamanho;

	@SuppressWarnings("unchecked")
	public DequeCircular(int capacidade) {
		if (capacidade <= 0) throw new IllegalArgumentException("Capacidade deve ser maior que zero");
		this.capacidade = capacidade;
		this.dados = (T[]) new Object[capacidade];
		this.inicio = 0;
		this.fim = -1;
		this.tamanho = 0;
	}

	public void adiciona(T elemento) {
		if (tamanho == capacidade) {
			inicio = (inicio + 1) % capacidade;
		} else {
			tamanho++;
		}
		fim = (fim + 1) % capacidade;
		dados[fim] = elemento;
	}

	public T remove() throws DequeVazioException {
		if (tamanho == 0) {
			throw new DequeVazioException("Deque vazio, não é possível remover");
		}
		T elemento = dados[inicio];
		dados[inicio] = null;
		inicio = (inicio + 1) % capacidade;
		tamanho--;
		return elemento;
	}

	public T pegaInicio() throws DequeVazioException {
		if (tamanho == 0) {
			throw new DequeVazioException("Deque vazio, não tem elemento no início");
		}
		return dados[inicio];
	}

	public int getTamanho() {
		return tamanho;
	}

	public boolean estaVazio() {
		return tamanho == 0;
	}

	public boolean estaCheio() {
		return tamanho == capacidade;
	}

	@Override
	public Iterator<T> iterator() {
		return new Iterator<T>() {
			int atual = 0;

			@Override
			public boolean hasNext() {
				return atual < tamanho;
			}

			@Override
			public T next() {
				if (!hasNext()) throw new NoSuchElementException();
				T elemento = dados[(inicio + atual) % capacidade];
				atual++;
				return elemento;
			}
		};
	}
=======
public class DequeCircular {

>>>>>>> a2c7b6a (Organizacao da branch e adicao de spring boot)
}
=======
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
>>>>>>> 31f4d18 (CSU04, CSU11)
