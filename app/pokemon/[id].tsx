import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { RootView } from "../components/RootView";
import { Row } from "../components/Row";
import { ThemedText } from "../components/ThemedText";
import useFetchQuery from "../hooks/useFetchQuery";
import { Colors } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";
import { formatPokemonHeight, formatPokemonWeight, getPokemonArtwork } from "../functions/pokemon";
import { Card } from "../components/Card";
import { PokemonType } from "../components/pokemon/PokemonType";
import { PokemonSpec } from "../components/pokemon/PokemonSpec";
import { PokemonStat } from "../components/pokemon/PokemonStat";

export default function Pokemon() {
    const colors = useThemeColors();
    const params = useLocalSearchParams() as {id: string};
    const {data: pokemon} = useFetchQuery("/pokemon/[id]", {id: params.id});
    const {data: specie} = useFetchQuery("/pokemon-species/[id]", {id: params.id});
    const mainType = pokemon?.types[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const bio = specie?.flavor_text_entries?.find(({language}) => language.name === 'en')?.flavor_text.replaceAll('\n', '. ');
    return  (
        <RootView style={{backgroundColor: colorType}}>
            <View>
                <Image source={require("@/assets/images/background-pokeball.png")} width={208} height={208} style={styles.pokeball} />
                <Row style={styles.header}>
                    <Pressable onPress={router.back}>
                        <Row gap={8}>
                            <Image source={require("@/assets/images/Arrow-back.png")} width={32} height={32} />
                            <ThemedText variant="headline" color="grayWhite" style={{textTransform: "capitalize"}}>{pokemon?.name}</ThemedText>
                        </Row>
                    </Pressable>
                    <ThemedText color="grayWhite" variant="subtitle2">#{params.id.padStart(3, '0')}</ThemedText>
                </Row>
                <View style={styles.body}>
                    <Image
                        style={styles.artwork}
                        source={{ uri: getPokemonArtwork(params.id) }}
                        width={200}
                        height={200}
                    />
                    <Card style={styles.card}>
                        <Row gap={16}>
                            {types.map(type => 
                                <PokemonType name={type.type.name} key={type.type.name} />
                            )}
                        </Row>

                        {/* About */}
                        <ThemedText variant="subtitle1" style={{color: colorType}}>About</ThemedText>
                        <Row>
                            <PokemonSpec style={{borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLight}} title={formatPokemonWeight(pokemon?.weight)} description="Weight" image={require('@/assets/images/weight.png')}/>
                            <PokemonSpec style={{ borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLight }}  title={formatPokemonHeight(pokemon?.height)} description="Height" image={require('@/assets/images/height.png')}/>
                            <PokemonSpec title={pokemon?.abilities.slice(0, 2).map(m => m.ability.name).join("\n")} description="Moves"/>
                        </Row>
                        <ThemedText>{bio}</ThemedText>

                        {/* Stats */}
                        <ThemedText variant="subtitle1" style={{color: colorType}}>Base stats</ThemedText>
                        <View style={{alignSelf: "stretch"}}>
                            {pokemon?.stats.map(stat => <PokemonStat key={stat.stat.name} name={stat.stat.name} value={stat.base_stat} color={colorType} />)}
                        </View>
                    </Card>
                </View>
            </View>
        </RootView>
    )
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: "space-between",
    },
    pokeball: {
        opacity: 0.1,
        position : "absolute",
        right: 8,
        top: 8
    },
    artwork: {
        position: "absolute",
        top: -140,
        alignSelf: "center",
        zIndex: 2,
    },
    body: {
        marginTop: 144,
    },
    card: {
        paddingHorizontal: 20,
        paddingTop: 60,
        gap: 16,
        alignItems: "center",
        paddingBottom: 20,
    }
})

// REPRENDRE LA VIDEO A 2H25