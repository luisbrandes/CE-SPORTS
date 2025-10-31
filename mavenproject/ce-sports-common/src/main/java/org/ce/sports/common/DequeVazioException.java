package org.ce.sports.common;

<<<<<<< HEAD
<<<<<<< HEAD
public class DequeVazioException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public DequeVazioException() {
        super();
    }

    public DequeVazioException(String message) {
        super(message);
    }
=======
public class DequeVazioException {

>>>>>>> a2c7b6a (Organizacao da branch e adicao de spring boot)
}
=======
public class DequeVazioException extends RuntimeException{
	private static final long serialVersionUID = 1L;

	public DequeVazioException() {
        System.out.println("ERRO: deque vazio");
    }
}
>>>>>>> 31f4d18 (CSU04, CSU11)
