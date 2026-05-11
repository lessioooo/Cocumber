import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Food} from "./food";

interface FoodCardProps{
    item: Food;
}

export default function FoodCard({item}: FoodCardProps){
    return(
        <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>

            <View style={styles.macroRow}>
                <Text style={styles.calories}>Calorie: {item.calories} kcal</Text>
                <Text>Proteine: {item.macros.protein}g</Text>
                <Text>Carboidrati: {item.macros.carbs}g</Text>
                <Text>Lipidi: {item.macros.fat}g</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Per fare l'ombra su Android
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  calories: {
    fontWeight: 'bold',
    color: '#e74c3c',
  }
});