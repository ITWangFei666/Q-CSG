package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func main() {
	// Init DB
	if err := initDB(); err != nil {
		log.Printf("WARNING: DB connection failed: %v (continuing without DB)", err)
	} else {
		log.Println("DB connected")
		runMigration()
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Gzip compression
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	// API routes
	api := r.Group("/api")
	{
		api.GET("/health", healthHandler)
		api.POST("/quiz/batch", quizBatchHandler)
		api.GET("/quiz/stats", quizStatsHandler)
		api.GET("/review/weakness", reviewWeaknessHandler)
		api.GET("/review/smart-path", reviewSmartPathHandler)
		api.GET("/review/day/:day", reviewDayHandler)
		api.GET("/admin/dashboard", adminDashboardHandler)
		api.GET("/admin/users", adminUsersHandler)
		api.GET("/admin/records", adminRecordsHandler)
	}

	// Serve static files (dist is ../dist relative to backend-go/)
	distPath := filepath.Join(".", "..", "dist")
	if _, err := os.Stat(distPath); os.IsNotExist(err) {
		// Try from cwd
		if cwd, err := os.Getwd(); err == nil {
			distPath = filepath.Join(cwd, "dist")
		}
	}
	r.Static("/assets", filepath.Join(distPath, "assets"))
	r.StaticFile("/favicon.svg", filepath.Join(distPath, "favicon.svg"))
	r.StaticFile("/icons.svg", filepath.Join(distPath, "icons.svg"))
	r.StaticFile("/index.html", filepath.Join(distPath, "index.html"))
	r.StaticFile("/404.html", filepath.Join(distPath, "404.html"))

	// SPA fallback
	r.NoRoute(func(c *gin.Context) {
		c.File(filepath.Join(distPath, "index.html"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8092"
	}

	log.Printf("Q-CSG Go server starting on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
