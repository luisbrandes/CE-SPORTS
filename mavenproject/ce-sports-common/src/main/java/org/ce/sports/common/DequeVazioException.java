package org.ce.sports.common;

public class DequeVazioException extends RuntimeException{
	private static final long serialVersionUID = 1L;

	public DequeVazioException() {
        System.out.println("ERRO: deque vazio");
    }
}