import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./components/ThemedText";
import { useThemeColors } from "./hooks/useThemeColors";
import { Card } from "./components/Card";
import PokemonCard from "./components/pokemon/PokemonCard";
import useFetchQuery, { useInfiniteFetchQuery } from "./hooks/useFetchQuery";
import { getPokemonId } from "./functions/pokemon";
import { SearchBar } from "./components/SearchBar";
import { useState } from "react";
import { Row } from "./components/Row";
import { SortButton } from "./components/SortButton";

export default function Index() {
   const colors = useThemeColors();
   const {data, isFetching, fetchNextPage} = useInfiniteFetchQuery("/pokemon?limit=21");
   const pokemons = data?.pages.flatMap(page => page.results.map(res => ({name: res.name, id: getPokemonId(res.url)}))) ?? [];
   const [search, setSearch] = useState("");
   const filteredPokemons = [...(
      search ? pokemons.filter(
          pokemon => pokemon.name.includes(search.toLowerCase()) || 
          pokemon.id.toString() === search
      ) : pokemons
    )].sort((a, b) => a[sortKey] > b[sortKey] ? -1 : 1);
   const [sortKey, setSortKey] = useState<"id" | "name">("id");

    return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]}>
      <Row style={styles.header} gap={16}>
        <Image source={require("@/assets/images/Pokeball.png")} width={24} height={24}/>
        <ThemedText variant="headline" color="grayLight">Pokédex</ThemedText>
      </Row>
      <Row gap={16} style={styles.form}>
        <SearchBar value={search} onChange={setSearch}/>
        <SortButton value={sortKey} onChange={setSortKey}/>
      </Row>
      <Card style={styles.body}>
        <FlatList 
          data={filteredPokemons} 
          numColumns={3}
          contentContainerStyle={[styles.gridGap, styles.list]}
          columnWrapperStyle={styles.gridGap}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={colors.tint}/> : null
          }
          onEndReached={search ? undefined : () => fetchNextPage()}
          renderItem={({item}) => (
          <PokemonCard id={item.id} name={item.name} style={{flex: 1/3}}/>
        )} keyExtractor={(item) => item.id.toString()}/>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  gridGap: {
    gap: 8
  },
  list: {
    padding: 12
  },
  form: {
    paddingHorizontal: 12,
  }
});