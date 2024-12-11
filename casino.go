package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"time"
)

// La structure de jeu
type Game struct {
	Balance int    `json:"balance"`
	Gain    int    `json:"gain"`
	Date    string `json:"date"`
}

// La structure de données du casino
type Data struct {
	Balance int    `json:"balance"`
	History []Game `json:"history"`
}

// Lire la balance et l'envoyer au HTML
func roulette(w http.ResponseWriter, r *http.Request) {
	data, err := readDataFromFile()
	if err != nil {
		fmt.Println("Erreur lors de la lecture des données:", err)
		http.Error(w, "Impossible de lire les données", http.StatusInternalServerError)
		return
	}

	var fileName = "roulette.html"
	t, err := template.ParseFiles(fileName)
	if err != nil {
		fmt.Println("Erreur lors de l'analyse du template:", err)
		http.Error(w, "Impossible d'analyser le template", http.StatusInternalServerError)
		return
	}

	err = t.Execute(w, data)
	if err != nil {
		fmt.Println("Erreur lors de l'exécution du template:", err)
		http.Error(w, "Impossible d'exécuter le template", http.StatusInternalServerError)
		return
	}
}

// Fonction pour afficher l'historique des gains
func historique(w http.ResponseWriter, r *http.Request) {
	data, err := readDataFromFile()
	if err != nil {
		fmt.Println("Erreur lors de la lecture des données:", err)
		http.Error(w, "Impossible de lire les données", http.StatusInternalServerError)
		return
	}

	var fileName = "historique.html"
	t, err := template.ParseFiles(fileName)
	if err != nil {
		fmt.Println("Erreur lors de l'analyse du template:", err)
		http.Error(w, "Impossible d'analyser le template", http.StatusInternalServerError)
		return
	}

	err = t.Execute(w, data)
	if err != nil {
		fmt.Println("Erreur lors de l'exécution du template:", err)
		http.Error(w, "Impossible d'exécuter le template", http.StatusInternalServerError)
		return
	}
}

// Fonction pour lire data.json
func readDataFromFile() (Data, error) {
	var data Data
	file, err := os.Open("data.json")
	if err != nil {
		return data, err
	}
	defer file.Close()

	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		return data, err
	}

	err = json.Unmarshal(bytes, &data)
	if err != nil {
		return data, err
	}

	return data, nil
}

// Fonction pour écrire les données dans le fichier
func writeDataToFile(data Data) error {
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	return ioutil.WriteFile("data.json", jsonData, 0644)
}

// Nouveau gestionnaire pour mettre à jour le solde et l'historique
func updateBalance(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	// Récupérer le token dans l'en-tête Authorization
	token := r.Header.Get("Authorization")
	expectedToken := "Jesuisuntokenbearer" // Remplacez par votre token attendu

	if token != expectedToken {
		http.Error(w, "Token invalide ou manquant", http.StatusUnauthorized)
		return
	}

	// Lire le corps de la requête
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var input struct {
		Number int `json:"number"`
	}

	// Décoder le JSON
	err = json.Unmarshal(body, &input)
	if err != nil {
		http.Error(w, "Erreur de décodage JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Lire les données existantes
	data, err := readDataFromFile()
	if err != nil {
		http.Error(w, "Impossible de lire les données", http.StatusInternalServerError)
		return
	}

	// Mettre à jour le solde
	data.Balance += input.Number
	newEntry := Game{
		Balance: data.Balance,
		Gain:    input.Number,
		Date:    time.Now().Format("2006-01-02 15:04:05"),
	}
	data.History = append(data.History, newEntry)

	// Enregistrer les nouvelles données
	err = writeDataToFile(data)
	if err != nil {
		http.Error(w, "Erreur lors de l'écriture des données", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(data)
}

// Rediriger la requête vers la route appropriée
func handler(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/":
		roulette(w, r)
	case "/historique":
		historique(w, r)

	}
}

// Fonction pour vérifier si data.json existe et le créer sinon
func checkAndCreateDataFile() {
	_, err := os.Stat("data.json")
	if os.IsNotExist(err) {
		file, err := os.Create("data.json")
		if err != nil {
			fmt.Println("Erreur lors de la création du fichier:", err)
			return
		}
		defer file.Close()

		data := Data{
			Balance: 500,
			History: []Game{},
		}

		jsonData, err := json.MarshalIndent(data, "", "  ")
		if err != nil {
			fmt.Println("Erreur lors de la conversion en JSON:", err)
			return
		}

		_, err = file.Write(jsonData)
		if err != nil {
			fmt.Println("Erreur lors de l'écriture dans le fichier:", err)
		} else {
			fmt.Println("data.json créé avec succès avec les données initiales.")
		}
	} else {
		fmt.Println("data.json existe déjà.")
	}
}

// Fonction pour ouvrir le navigateur
func openBrowser(url string) {
	var err error
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("système d'exploitation non pris en charge")
	}
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du navigateur :", err)
	}
}

func main() {
	checkAndCreateDataFile()

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", handler)
	http.HandleFunc("/update-balance", updateBalance)

	go func() {
		fmt.Println("Serveur démarré sur http://localhost:8080")
		if err := http.ListenAndServe(":8080", nil); err != nil {
			fmt.Println("Erreur serveur :", err)
		}
	}()

	openBrowser("http://localhost:8080")

	select {}
}
