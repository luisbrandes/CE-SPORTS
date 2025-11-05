package org.ce.sports.common;

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
