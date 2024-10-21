import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { RootView } from "../components/RootView";
import { Row } from "../components/Row";
import { ThemedText } from "../components/ThemedText";
import useFetchQuery from "../hooks/useFetchQuery";
import { Colors } from "../constants/Colors";
import { useThemeColors } from "../hooks/useThemeColors";
import { basePokemonStats, formatPokemonHeight, formatPokemonWeight, getPokemonArtwork } from "../functions/pokemon";
import { Card } from "../components/Card";
import { PokemonType } from "../components/pokemon/PokemonType";
import { PokemonSpec } from "../components/pokemon/PokemonSpec";
import { PokemonStat } from "../components/pokemon/PokemonStat";
import { Audio } from "expo-av";
import PagerView from "react-native-pager-view";
import { useRef, useState } from "react";

export default function Pokemon() {
    const params = useLocalSearchParams() as {id: string};
    const [id, setId] = useState(parseInt(params.id, 10));
    const offset = useRef(1);
    const pager = useRef<PagerView>(null);

    const onPageSelected = (e: {nativeEvent: {position: number}}) => {
        offset.current = e.nativeEvent.position - 1;
    }

    const onPageScrollStateChanged = (e: { nativeEvent: { pageScrollState: string } }) => {
        if(e.nativeEvent.pageScrollState !== "idle") return;
        if(offset.current === -1 && id === 2) return;
        if(offset.current !== 1 && id === 299) return;
        

        if(offset.current !== 0) {
            setId(id + offset.current);
            offset.current = 0;
            pager.current?.setPageWithoutAnimation(1);
        }
    }

    const onPrevious = () => {
        pager.current?.setPage(0);
    }

    const onNext = () => {
        pager.current?.setPage(2 + offset.current);
    }

    return (
        <PagerView 
            ref={pager}
            style={{flex: 1}}
            onPageSelected={onPageSelected}
            onPageScrollStateChanged={onPageScrollStateChanged}
            initialPage={1} 
        >
            <PokemonView key={id - 1} id={id - 1} onNext={onNext} onPrevious={onPrevious}/>
            <PokemonView key={id} id={id} onNext={onNext} onPrevious={onPrevious}/>
            <PokemonView key={id + 1} id={id + 1} onNext={onNext} onPrevious={onPrevious}/>
        </PagerView>
    )
}

type Props = {
    id: number;
    onPrevious: () => void;
    onNext: () => void;
}

function PokemonView({id, onPrevious, onNext} : Props) {
    const colors = useThemeColors();
    const {data: pokemon} = useFetchQuery("/pokemon/[id]", {id: id});
    const {data: specie} = useFetchQuery("/pokemon-species/[id]", {id: id});
    const mainType = pokemon?.types[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const bio = specie?.flavor_text_entries?.find(({language}) => language.name === 'en')?.flavor_text.replaceAll('\n', '. ');
    const stats = pokemon?.stats ?? basePokemonStats;
    const onImagePress = () => {
        const cry = pokemon?.cries.latest;
        if(!cry) return;
        Audio.Sound.createAsync({uri: cry}).then(({sound}) => sound.playAsync());
    }
 

    const isFirst = id === 1;
    const isLast = id === 300;

    return  (
        <RootView backgroundColor={colorType}>
            <View>
                <Image source={require("@/assets/images/background-pokeball.png")} width={208} height={208} style={styles.pokeball} />
                <Row style={styles.header}>
                    <Pressable onPress={router.back}>
                        <Row gap={8}>
                            <Image source={require("@/assets/images/Arrow-back.png")} width={32} height={32} />
                            <ThemedText variant="headline" color="grayWhite" style={{textTransform: "capitalize"}}>{pokemon?.name}</ThemedText>
                        </Row>
                    </Pressable>
                    <ThemedText color="grayWhite" variant="subtitle2">#{id.toString().padStart(3, '0')}</ThemedText>
                </Row>
                    <Card style={styles.card}>
                        <Row style={styles.imageRow}>
                            {isFirst ? (
                                <View style={{ width: 24, height: 24 }} />
                            ) : (
                                <Pressable onPress={onPrevious}>
                                    <Image
                                        source={require('@/assets/images/previous-pokemon.png')}
                                        width={24}
                                        height={24}
                                    />
                                </Pressable>
                            )}
                            <Pressable onPress={onImagePress}>
                                <Image
                                    source={{ uri: getPokemonArtwork(id) }}
                                    width={200}
                                    height={200}
                                />
                            </Pressable>
                            {isLast ? (
                                <View style={{ width: 24, height: 24 }} />
                            ) : (
                                <Pressable onPress={onNext}>
                                    <Image
                                        source={require('@/assets/images/next-pokemon.png')}
                                        width={24}
                                        height={24}
                                    />
                                </Pressable>
                            )}
                        </Row>
                        <Row gap={16} style={{height: 20}}>
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
                        <ThemedText style={{height: 30}}>{bio}</ThemedText>

                        {/* Stats */}
                        <ThemedText variant="subtitle1" style={{color: colorType}}>Base stats</ThemedText>
                        <View style={{alignSelf: "stretch"}}>
                            {stats.map(stat => <PokemonStat key={stat.stat.name} name={stat.stat.name} value={stat.base_stat} color={colorType} />)}
                        </View>
                    </Card>
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
    imageRow: {
        position: "absolute",
        top: -140,
        zIndex: 2,
        justifyContent: "space-between",
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    card: {
        marginTop: 144,
        paddingHorizontal: 20,
        paddingTop: 60,
        gap: 16,
        alignItems: "center",
        overflow: "visible",
        paddingBottom: 20,
    }
})

// REPRENDRE LA VIDEO A 2H25