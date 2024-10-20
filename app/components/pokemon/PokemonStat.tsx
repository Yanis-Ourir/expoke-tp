import { StyleSheet, View, ViewProps } from "react-native"
import { Row } from "../Row"
import { ThemedText } from "../ThemedText"
import { useThemeColors } from "@/app/hooks/useThemeColors"
import { formatStatName } from "@/app/functions/pokemon"


type Props = ViewProps & {
    name: string,
    value: number,
    color: string,
}

export function PokemonStat({ style, color, name, value, ...rest }: Props) {
    const colors = useThemeColors();
    return (
        <Row gap={8} style={[style, styles.root]} {...rest}>
            <View style={[styles.name, {borderColor: colors.grayLight}]}>
                <ThemedText variant="subtitle3" style={{color: color}}>{formatStatName(name)}</ThemedText>
            </View>
            <View style={styles.number}>
                <ThemedText>{value.toString().padStart(3, '0')}</ThemedText>
            </View>
            <Row style={styles.bar}>
                <View style={[styles.barInner, { flex: value, backgroundColor: color }]}>

                </View>
                <View style={[styles.barBackground, { flex: 255 - value, backgroundColor: color }]}>

                </View>
            </Row>
        </Row>
    )
}

const styles = StyleSheet.create({
    root: {

    },
    name: {
        width: 40,
        paddingRight: 8,
        borderRightWidth: 1,
        borderStyle: "solid",
    },
    number: {
        width: 23,
    },
    bar: {
        flex: 1,
        borderRadius: 20,
        height: 4,
        overflow: "hidden",
    },
    barInner: {
        height: 4,
    },
    barBackground: {
        height: 4,
        opacity: 0.24,
    }
})