import {StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react'
import React from 'react';
import { Food } from '../../components/food';
import FoodCard from '../../components/foodCard';
import { apple, chicken } from '../../components/dummydata';



export default function HomeScreen() {
  const [diario, setDiario] = useState<Food[]>([]);

  const calorieTotali = diario.reduce((totale, cibo) => totale + cibo.calories, 0);
  const mangiaMela = () => {
    setDiario([...diario, apple]);
  }
  const rimuoviMela = () => {
    const nuovoDiario = diario.slice(0, -1);
    setDiario(nuovoDiario);
  }
  return (
    <View style={styles.container}>
      {/* LA DASHBOARD IN ALTO */}
      <View style={styles.dashboard}>
        <Text style={styles.title}>Calorie di Oggi</Text>
        <Text style={styles.calorieCount}>{calorieTotali} kcal</Text>
      </View>

      {/* IL BOTTONE PER AGGIUNGERE CIBO */}
      <TouchableOpacity style={styles.button} onPress={mangiaMela}>
        <Text style={styles.buttonText}>+ Mangia una Mela (52 kcal)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={rimuoviMela}>
        <Text style={styles.buttonText}>- Fanculo una Mela (Fanculo)</Text>
      </TouchableOpacity>

      {/* LA LISTA DEI CIBI CHE HAI MANGIATO */}
      <Text style={styles.subtitle}>Il tuo Diario:</Text>
      <FlatList 
        data={diario}
        keyExtractor={(item, index) => index.toString()} 
        renderItem={({ item }) => <FoodCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f4',
  },
  dashboard: {
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calorieCount: {
    color: 'white',
    fontSize: 36,
    fontWeight: '900',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});
