const Roulette = {

    angle: 0, // Angle de rotation de la roulette

    balance: 0, // Solde du joueur

    jetonMise: 1, // Valeur du jeton misé

    miseJoueur: {}, // Historique des mises du joueur

    isTurning: false,

    vitesseRotation : 5,

    i:0,

    initialiser: function() {
        this.balance = $("#balance").val(); // Lire le solde initial

        this.ecouterJeton(); // Écouter les clics sur les jetons
        this.ecouterPlateau(); // Écouter les clics sur le plateau de jeu
        this.ecouterRoulette(); // Écouter les événements liés à la roulette
        this.ecouterTourner();
        
    },

    ecouterJeton: function() {
        $(".jeton").on("click", (event) => { // Utiliser une fonction fléchée pour préserver le contexte de 'this'
            this.jetonMise = $(event.currentTarget).data("valeur"); // Récupérer la valeur du jeton cliqué
            $(".jeton").removeClass("jetonActive"); // Retirer la classe 'jetonActive' de tous les jetons
            $(event.currentTarget).addClass("jetonActive"); // Ajouter la classe 'jetonActive' au jeton cliqué
        });
    },

    ecouterPlateau: function() {
        $(".case").on("click", (event) => { // Utiliser une fonction fléchée pour préserver le contexte de 'this'
            var dataCase = $(event.currentTarget).data("case"); // Récupérer les données de la case cliquée
            
            // Vérifier si le solde est suffisant pour la mise
            if (this.balance - this.jetonMise >= 0) {
                
                // Vérifier si la case a déjà une mise
                if (dataCase in this.miseJoueur) {
    
                    miseCase = this.miseJoueur[dataCase] + this.jetonMise; // Ajouter la mise au montant existant
                    this.miseJoueur[dataCase] = miseCase; // Mettre à jour la mise du joueur
                } else {
                    miseCase = this.jetonMise; // Sinon, c'est la première mise sur cette case
                    this.miseJoueur[dataCase] = miseCase; // Enregistrer la mise pour cette case
                }
                $(event.currentTarget).find(".caseMise").html(miseCase); // Mettre à jour l'affichage de la mise sur la case

                console.log(this.miseJoueur);

                var newMise = parseInt($("#valMise").val()) + this.jetonMise; // Calculer la nouvelle mise totale
                $("#valMise").val(newMise); // Mettre à jour la valeur de la mise totale
                $("#txtMise").html(newMise); // Afficher la nouvelle mise

                var newReste = parseInt($("#valReste").val()) - this.jetonMise; // Calculer le reste après mise
                $("#valReste").val(newReste); // Mettre à jour le reste
                $("#txtReste").html(newReste); // Afficher le reste
            }

        });
    },


    angle2numero : function(angle){

        if(angle > 5 && angle <= 12){
            return 9;
        }else if(angle > 12 && angle <= 22){
            return 31;
        }else if(angle > 22 && angle <= 32){
            return 14;
        }else if(angle >32 && angle <= 42){
            return 20
        }else if( angle > 42 && angle <= 50){
            return 1;
        }else if (angle > 50 && angle <= 60){
            return 33;
        }else if(angle > 60 && angle <= 71){
            return 16;
        }else if(angle > 71 && angle <= 80 ){
            return 24;
        }else if(angle >80 && angle <= 90){
            return 5;
        }else if(angle > 90 && angle <= 100){
            return 10;
        }else if(angle > 100 && angle <= 109){
            return 23;
        }else if(angle > 109 && angle <= 118){
            return 8;
        }else if(angle > 118 && angle <= 128){
            return 30;
        }else if(angle > 128 && angle <= 138){
            return 11;
        }else if(angle > 138 && angle <= 148){
            return 36;
        }else if(angle > 148 && angle <= 156){
            return 13;
        }else if(angle > 156 && angle <= 167){
            return 27;
        }else if(angle > 167 && angle <= 178){
            return 6;
        }else if(angle > 178 && angle <= 187){
            return 34;
        }else if(angle > 187 && angle <= 198){
            return 17;
        }else if(angle > 198 && angle <= 206){
            return 25;
        }else if(angle > 206 && angle <= 216){
            return 2;
        }else if(angle > 216 && angle <= 226){
            return 21;
        }else if(angle > 226 && angle <= 235){
            return 4;
        }else if(angle > 235 && angle <= 246){
            return 19;
        }else if(angle > 246 && angle <= 254){
            return 15;
        }else if(angle > 254 && angle <= 264){
            return 32;
        }else if(angle > 264 && angle <= 275){
            return 0;
        }else if(angle > 275 && angle <= 284){
            return 26;
        }else if(angle > 284 && angle <= 295){
            return 3;
        }else if(angle > 295 && angle <= 305){
            return 35;
        }else if(angle > 305 && angle <= 314){
            return 12;
        }else if(angle > 314 && angle <= 322){
            return 28;
        }else if(angle > 322 && angle <= 332){
            return 7;
        }else if(angle > 332 && angle <= 343){
            return 29;
        }else if(angle > 343 && angle <= 352){
            return  18;
        }else if(angle > 352 || angle <= 5){
            return 22;
        }
    },

    ecouterTourner: function(){
        $("#btnLancer").on("click", event => {
            $("#btnLancer").addClass("btnTurning");
            if(this.isTurning == false){
                let min = 120;
                let max = 210;
                let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                this.isTurning = true;
                this.tournerRoulette(randomNumber);
            }
        });
    },

    tournerRoulette : function(nombre){
        if(this.i <= nombre){
            if(this.i <= nombre / 2){
                this.vitesseRotation = 8;
            }else if(this.i > nombre / 2 && this.i <= nombre * 3 / 4){
                this.vitesseRotation = 5;
            }else if(this.i > this.i < nombre * 3 / 4 && this.i < nombre * 7/8){
                this.vitesseRotation = 3;
            }else{
                this.vitesseRotation = 1;
            }
    
            document.getElementById("rouletteImageCasino").style.transform = `rotate(${this.angle}deg)`;
            this.angle += this.vitesseRotation;
            this.angle = this.angle % 360;
            this.i++;
    
            requestAnimationFrame(() => this.tournerRoulette(nombre));
        } else {
            this.isTurning = false;
            this.i = 0;
            
            this.finRoulette();
        }
    },
    
    finRoulette : function(){
        var resultat = this.angle2numero(this.angle);
        if(resultat %2 ==0){
            $("#resultChiffre").html("LE RESULTAT EST LE CHIFFRE : <span style='color:black;font-weight:bold'>"+resultat+"</span>");
        }else{ 
            $("#resultChiffre").html("LE RESULTAT EST LE CHIFFRE : <span style='color:red;font-weight:bold'>"+resultat+"</span>");
        }
        
        var argentResultat = this.calculerArgent(resultat);
        if(argentResultat < 0){
            $("#resultatGain").html("VOUS AVEZ PERDU " + (argentResultat * -1).toString() + " EUROS")
        }else{
            $("#resultatGain").html("VOUS AVEZ GAGNE " + (argentResultat).toString() + " EUROS")
        }

        this.reinitialiser(argentResultat);
    },

    reinitialiser: function(gain){
        const self = this; // Preserve the context of 'this'
        $.ajax({
            url: '/update-balance',
            type: 'POST',
            contentType: 'application/json', // Indique que le corps de la requête est en JSON
            data: JSON.stringify({ "number": gain }), // Convertit l'objet en chaîne JSON
            success: function(response) {
                $("#btnLancer").removeClass("btnTurning");

                $("#valMise").val(0);
                $("#txtMise").html(0);

                self.miseJoueur = {};
                console.log("mise a rien");
                $(".caseMise").html("");
                console.log(parseInt($("#balance").val()));
                var newBalance = parseInt($("#balance").val()) + gain;
                $("#valReste").val(newBalance);
                $("#txtReste").html(newBalance);

                $("#balance").val(newBalance);
                $("#txtBalance").html(newBalance);
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
            }
        });
        
    },

    calculerArgent : function(resultat){

        var mise = parseInt($("#valMise").val());
        var gain = mise * -1;
        if(resultat % 2 == 0){
            if("pair" in this.miseJoueur){
                gain += this.miseJoueur["pair"] * 2;
            }
            if("noir" in this.miseJoueur){
                gain += this.miseJoueur["noir"] * 2;
              
            }
        }else{
            if("impair" in this.miseJoueur){
                gain+= this.miseJoueur["impair"] * 2;
            }
            if("rouge" in this.miseJoueur){
                gain += this.miseJoueur["rouge"] * 2;
            }
        }

        if(resultat in this.miseJoueur){
            gain += this.miseJoueur[resultat] * 36;
        }

        return gain;
        
    },

    ecouterRoulette: function() {
        // Utiliser une fonction fléchée pour maintenir le contexte de 'this'
        document.addEventListener("keydown", (event) => {
            if (event.key === "Enter") { // Vérifier si la touche pressée est "Entrée"
                this.angle += 1; // Augmenter l'angle de rotation
                this.angle = this.angle % 360;
    
                document.getElementById("rouletteImageCasino").style.transform = `rotate(${this.angle}deg)`; // Faire tourner l'image
            }

            if (event.key === "f") { // Vérifier si la touche pressée est "Entrée"
                this.angle -= 1; // Augmenter l'angle de rotation
                this.angle = this.angle % 360;

                document.getElementById("rouletteImageCasino").style.transform = `rotate(${this.angle}deg)`; // Faire tourner l'image
            }
        });
    }
}

$(document).ready(function() {
    Roulette.initialiser(); // Initialiser le jeu lorsque le document est prêt
});
