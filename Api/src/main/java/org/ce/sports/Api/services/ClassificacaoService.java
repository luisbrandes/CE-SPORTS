package org.ce.sports.Api.services;

import org.ce.sports.Api.dtos.ClassificacaoEquipe;
import org.ce.sports.Api.entities.Campeonato;
import org.ce.sports.Api.entities.Partida;
import org.ce.sports.Api.entities.repositories.PartidaRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClassificacaoService {
    
    private final PartidaRepository partidaRepository;
    
    public ClassificacaoService(PartidaRepository partidaRepository) {
        this.partidaRepository = partidaRepository;
    }
    
    public List<ClassificacaoEquipe> calcularClassificacao(Campeonato campeonato) {
        List<Partida> partidas = partidaRepository.findByCampeonatoId(campeonato.getId());
        Map<String, ClassificacaoBuilder> classificacaoMap = new HashMap<>();
        
        campeonato.getEquipes().forEach(equipe -> {
            classificacaoMap.put(equipe.getNome(), new ClassificacaoBuilder(equipe.getNome()));
        });
        
        for (Partida partida : partidas) {
            if (!partida.isConcluida()) continue;
            
            String equipe1 = partida.getEquipe1().getNome();
            String equipe2 = partida.getEquipe2().getNome();
            
            ClassificacaoBuilder builder1 = classificacaoMap.get(equipe1);
            ClassificacaoBuilder builder2 = classificacaoMap.get(equipe2);
            
            if (builder1 == null || builder2 == null) continue;
            
            builder1.adicionarJogo(partida.getPontuacao1(), partida.getPontuacao2(), partida.isEmpate(), partida.getVencedor() != null && partida.getVencedor().getNome().equals(equipe1));
            builder2.adicionarJogo(partida.getPontuacao2(), partida.getPontuacao1(), partida.isEmpate(), partida.getVencedor() != null && partida.getVencedor().getNome().equals(equipe2));
            
            if (partida.isEmpate()) {
                builder1.adicionarPontos(campeonato.getEmpate());
                builder2.adicionarPontos(campeonato.getEmpate());
            } else if (partida.getVencedor() != null && partida.getVencedor().getNome().equals(equipe1)) {
                builder1.adicionarPontos(campeonato.getVitoria());
                builder2.adicionarPontos(campeonato.getDerrota());
            } else {
                builder1.adicionarPontos(campeonato.getDerrota());
                builder2.adicionarPontos(campeonato.getVitoria());
            }
        }
        
        return classificacaoMap.values()
                .stream()
                .map(ClassificacaoBuilder::build)
                .sorted((a, b) -> Integer.compare(b.pontos(), a.pontos()))
                .collect(Collectors.toList());
    }
    
    private static class ClassificacaoBuilder {
        private final String nomeEquipe;
        private int pontos = 0;
        private int jogos = 0;
        private int vitorias = 0;
        private int derrotas = 0;
        private int empates = 0;
        private int golsPro = 0;
        private int golsContra = 0;
        
        public ClassificacaoBuilder(String nomeEquipe) {
            this.nomeEquipe = nomeEquipe;
        }
        
        public void adicionarJogo(int golsPro, int golsContra, boolean empate, boolean vitoria) {
            this.jogos++;
            this.golsPro += golsPro;
            this.golsContra += golsContra;
            
            if (empate) {
                this.empates++;
            } else if (vitoria) {
                this.vitorias++;
            } else {
                this.derrotas++;
            }
        }
        
        public void adicionarPontos(int pontos) {
            this.pontos += pontos;
        }
        
        public ClassificacaoEquipe build() {
            return new ClassificacaoEquipe(
                nomeEquipe,
                pontos,
                jogos,
                vitorias,
                derrotas,
                empates,
                golsPro,
                golsContra,
                golsPro - golsContra
            );
        }
    }
}