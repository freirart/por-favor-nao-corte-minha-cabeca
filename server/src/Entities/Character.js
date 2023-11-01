export class BaseCharacter {
    name = "";
    favoriteAction = "";

    constructor(
        name,
        favoriteAction,
        catchPhrase,
        escalpoPhrase,
        normalizedName = ""
    ) {
        this.name = name;
        this.favoriteAction = favoriteAction;
        this.catchPhrase = catchPhrase;
        this.escalpoPhrase = escalpoPhrase;
        this.normalizedName = normalizedName
            ? normalizedName
            : name.toLowerCase();
    }
}

export const BOCAO = new BaseCharacter(
    "Bocão",
    "food",
    "ME ESPEREM, NÃO ME DEIXEM PARA TRÁS!",
    "ADORO CARNE FRESCA!",
    "bocao"
);

export const FRED = new BaseCharacter(
    "Fred",
    "boat",
    "CORRE GALERA, EU CUIDO DELE!",
    "NÃO ADIANTA CORRER!"
);

export const JAIME = new BaseCharacter(
    "Jaime",
    "bonfire",
    "FAÇAM FILA E ME SIGAM, CRIANÇAS!",
    "TÁ NA HORA DE DORMIR!"
);

export const SERENA = new BaseCharacter(
    "Serena",
    "mountain",
    "CALMA PESSOAL, VAI DAR TUDO CERTO.",
    "RELAXA, NÃO VAI DOER NADA."
);

export const TATI = new BaseCharacter(
    "Tati",
    "tent",
    "PRIMEIRO AS DAMAS, GENTE.",
    "QUEM É O PRÓXIMO?"
);

export const ZECA = new BaseCharacter(
    "Zeca",
    "",
    "SAIAM DA MINHA FRENTE!",
    "NÃO TEM PARA ONDE CORRER?"
);

export class Characters {
    static characters = [BOCAO, FRED, JAIME, SERENA, TATI, ZECA];

    static findByName(name) {
        return Characters.characters.find(
            (character) => character.name === name
        );
    }

    static getAvailableActions() {
        const allActions = Characters.characters.map((c) => c.favoriteAction);
        const filteredActions = allActions.filter((a) => a);

        return filteredActions;
    }
}
