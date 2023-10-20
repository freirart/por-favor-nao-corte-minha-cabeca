export class BaseCharacter {
    name = "";
    favoriteAction = "";

    constructor(name, favoriteAction, catchPhrase, escalpoPhrase) {
        this.name = name;
        this.favoriteAction = favoriteAction;
        this.catchPhrase = catchPhrase;
        this.escalpoPhrase = escalpoPhrase;
    }
}

export class Characters {
    static characters = [
        new BaseCharacter(
            "Bocão",
            "food",
            "ME ESPEREM, NÃO ME DEIXEM PARA TRÁS!",
            "ADORO CARNE FRESCA!"
        ),
        new BaseCharacter(
            "Fred",
            "dock",
            "CORRE GALERA, EU CUIDO DELE!",
            "NÃO ADIANTA CORRER!"
        ),
        new BaseCharacter(
            "Jaime",
            "bonfire",
            "FAÇAM FILA E ME SIGAM, CRIANÇAS!",
            "TÁ NA HORA DE DORMIR!"
        ),
        new BaseCharacter(
            "Serena",
            "mountain",
            "CALMA PESSOAL, VAI DAR TUDO CERTO.",
            "RELAXA, NÃO VAI DOER NADA."
        ),
        new BaseCharacter(
            "Tati",
            "tent",
            "PRIMEIRO AS DAMAS, GENTE.",
            "QUEM É O PRÓXIMO?"
        ),
        new BaseCharacter(
            "Zeca",
            "",
            "SAIAM DA MINHA FRENTE!",
            "NÃO TEM PARA ONDE CORRER?"
        ),
    ];

    static findByName(name) {
        return this.characters.find((character) => character.name === name);
    }
}
