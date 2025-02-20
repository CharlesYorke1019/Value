import { View } from "react-native"

interface feedProps {
    display: any
    data: any
}

const Feed: React.FC<feedProps> = ({display, data}) => {

    console.log(data);

    return (
        <View style={{flex: 1}}>



        </View>
    )
}

export default Feed

