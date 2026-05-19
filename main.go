package main

import (
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

var OK = []byte("ok")

func init() {
	_ = godotenv.Load(".env")
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.Handle("/public/",
		http.StripPrefix("/public/",
			http.FileServer(http.Dir("public")),
		),
	)

	http.HandleFunc("/health-check", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write(OK)
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		mainT, err := template.ParseFiles("internal/templates/main-page.html.tmpl")
		if err != nil {
			log.Println("[ERROR] could parse html file: ", err)
			http.Error(w, "Something went really wrong", http.StatusInternalServerError)
			return
		}

		if err = mainT.Execute(w, nil); err != nil {
			log.Println("[ERROR] Couldn't parse the web page: ", err)
			http.Error(w, "Something went really wrong", http.StatusInternalServerError)
			return
		}
	})

	log.Printf("Application running on port %s\n", port)
	log.Fatalln(http.ListenAndServe(":"+port, nil))
}
