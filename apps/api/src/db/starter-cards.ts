import type { DeckLayer } from '@efd/shared';

interface StarterCard {
  front: string;
  back: string;
  example?: string;
}

/** Starter cards per deck layer. Backs are in Portuguese to help at the beginner level. */
export const starterCards: Record<DeckLayer, StarterCard[]> = {
  vocabulary: [
    { front: 'to improve', back: 'melhorar', example: 'I want to improve my English.' },
    { front: 'to achieve', back: 'alcançar, conquistar', example: 'We achieved our goal this sprint.' },
    { front: 'to struggle (with)', back: 'ter dificuldade (com)', example: 'I struggled with the legacy code.' },
    { front: 'skill', back: 'habilidade', example: 'Communication is a key skill.' },
    { front: 'goal', back: 'meta, objetivo', example: 'My goal is to work abroad.' },
    { front: 'to learn', back: 'aprender', example: 'I learn something new every day.' },
    { front: 'challenge', back: 'desafio', example: 'The biggest challenge was the deadline.' },
    { front: 'to handle', back: 'lidar com', example: 'I can handle pressure well.' },
    { front: 'team', back: 'time, equipe', example: 'I worked on a team of five developers.' },
    { front: 'to own (a task)', back: 'ser responsável por', example: 'I owned the payments feature.' },
  ],
  phrases: [
    { front: 'Could you repeat that, please?', back: 'Você poderia repetir, por favor?' },
    { front: 'Could you speak a bit more slowly?', back: 'Você poderia falar um pouco mais devagar?' },
    { front: 'Let me think about that for a second.', back: 'Deixa eu pensar um segundo sobre isso.' },
    { front: 'What do you mean by...?', back: 'O que você quer dizer com...?' },
    { front: 'In my experience, ...', back: 'Na minha experiência, ...' },
    { front: 'That makes sense.', back: 'Faz sentido.' },
    { front: "I'm not sure, but I think...", back: 'Não tenho certeza, mas acho que...' },
    { front: 'Just to make sure I understood...', back: 'Só para confirmar que entendi...' },
  ],
  tech: [
    { front: 'deploy', back: 'publicar em produção', example: 'We deploy to production twice a week.' },
    { front: 'bug fix', back: 'correção de bug', example: 'The release includes three bug fixes.' },
    { front: 'code review', back: 'revisão de código', example: 'Every PR needs a code review.' },
    { front: 'trade-off', back: 'troca, prós e contras de uma escolha', example: 'Caching is a trade-off between speed and freshness.' },
    { front: 'to scale', back: 'escalar', example: 'The service scales horizontally.' },
    { front: 'bottleneck', back: 'gargalo', example: 'The database was the bottleneck.' },
    { front: 'to refactor', back: 'refatorar', example: 'I refactored the module to remove duplication.' },
    { front: 'requirement', back: 'requisito', example: 'The requirements changed mid-sprint.' },
    { front: 'downtime', back: 'tempo fora do ar', example: 'We migrated with zero downtime.' },
    { front: 'on-call', back: 'de plantão', example: 'I was on-call during the incident.' },
  ],
  interview: [
    { front: 'Tell me about yourself.', back: 'Fale sobre você. (pitch de 1 a 2 minutos: presente, passado, futuro)' },
    { front: "I'm a software developer with X years of experience in...", back: 'Sou desenvolvedor com X anos de experiência em...' },
    { front: 'I was responsible for...', back: 'Eu era responsável por...' },
    { front: 'As a result, ...', back: 'Como resultado, ... (o R do STAR)' },
    { front: 'One thing I learned from that was...', back: 'Uma coisa que aprendi com isso foi...' },
    { front: "I'm looking for a role where I can...", back: 'Estou procurando uma vaga onde eu possa...' },
    { front: 'What does a typical day look like for this role?', back: 'Como é um dia típico nessa vaga? (pergunta para fazer ao entrevistador)' },
    { front: 'What are the next steps in the process?', back: 'Quais são os próximos passos do processo?' },
  ],
};
