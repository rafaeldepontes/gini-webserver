package main

import (
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

var (
	OK        = []byte("ok")
	templates *template.Template
)

func init() {
	_ = godotenv.Load(".env")
	// Parse all templates in internal/templates at startup
	templates = template.Must(template.ParseGlob("internal/templates/*.html.tmpl"))
}

// render is a helper to serve HTML templates
func render(w http.ResponseWriter, name string, data interface{}) {
	err := templates.ExecuteTemplate(w, name, data)
	if err != nil {
		log.Printf("[ERROR] Couldn't render template %s: %v\n", name, err)
		http.Error(w, "Something went really wrong", http.StatusInternalServerError)
	}
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
		render(w, "main-page.html.tmpl", nil)
	})

	log.Printf("Application running on port %s\n", port)
	log.Fatalln(http.ListenAndServe(":"+port, nil))
}
