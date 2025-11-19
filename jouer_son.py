#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour jouer un fichier audio
"""

import pygame
import sys
import os

def jouer_son(fichier_audio):
    """
    Joue un fichier audio
    
    Args:
        fichier_audio (str): Chemin vers le fichier audio à jouer
    """
    # Initialiser pygame mixer
    pygame.mixer.init()
    
    # Vérifier si le fichier existe
    if not os.path.exists(fichier_audio):
        print(f"Erreur: Le fichier '{fichier_audio}' n'existe pas.")
        return False
    
    try:
        # Charger le fichier audio
        print(f"Chargement de '{fichier_audio}'...")
        pygame.mixer.music.load(fichier_audio)
        
        # Jouer le son
        print("Lecture du son...")
        pygame.mixer.music.play()
        
        # Attendre que la lecture soit terminée
        while pygame.mixer.music.get_busy():
            pygame.time.wait(100)
        
        print("Lecture terminée.")
        return True
        
    except pygame.error as e:
        print(f"Erreur lors de la lecture: {e}")
        return False
    finally:
        pygame.mixer.quit()

if __name__ == "__main__":
    # Vérifier les arguments de ligne de commande
    if len(sys.argv) > 1:
        fichier = sys.argv[1]
    else:
        # Demander le fichier à l'utilisateur
        fichier = input("Entrez le chemin du fichier audio à jouer: ").strip()
    
    if fichier:
        jouer_son(fichier)
    else:
        print("Aucun fichier spécifié.")

