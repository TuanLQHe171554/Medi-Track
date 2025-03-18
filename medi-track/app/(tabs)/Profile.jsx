import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getLocalStorage } from '../../service/Storage';
import Colors from '../../constant/Colors';
export default function Profile() {
  const [user, setUser] = useState();
  const Menu =[
    
    {
      id:3,
      name:'Add New Medication',
      icon:'add-circle',
      path:'/add-new-medication'
    },
    {
      id:5,
      name:'My Medication',
      icon:'medkit',
      path:'(tabs)'
    },
    {
      id:2,
      name:'History',
      icon: 'time',
      path:'(tabs)/History'
    },{
      id:4,
      name:'Logout',
      icon:'exit',
      path:'logout'
    },
  ]
  const router = useRouter();
  const onPressMenu=(menu)=>{
    return ()=>{
      router.push(menu.path);
    }
  }
  useEffect(() => {
    GetUser();
  }, []);
  const GetUser = async () => {
    const userData = await getLocalStorage("userDetails");
    setUser(userData);
  };
  return (
    <View style={{
      padding:25,
      backgroundColor:'white',
      height:'100%'
    }}>
      <Text style={{
        fontSize:30,
        fontWeight:'bold'
      }}>Profile</Text>
      <View style={{
        display:'flex',
        alignItems:'center',
        marginVertical:25,
      }}>
        <Image source={require('./../../assets/images/smiley.png')} 
        style={{
          width:80,
          height:80,
        }}
        />
        <Text style={{
          fontSize:24,
          fontWeight:'bold',
          marginTop:6
        }}>{user?.displayName}</Text>
        <Text style={{
          fontSize:16,
          color:Colors.GRAY
        }}>{user?.email}</Text>
      </View>
      <FlatList
      data={Menu}
      renderItem={({item,index})=>(
        <TouchableOpacity onPress={onPressMenu(item)}
        key={item.id}
        style={{
          marginVertical:10,
          display:'flex',
          flexDirection:'row',
          alignItems:'center',
          gap:10,
          backgroundColor:'white',
          padding:10,
          borderRadius:10,
        }}>
          <Ionicons name={item.icon} size={30} 
          color={Colors.PRIMARY}
          style={{
            padding:10,
            backgroundColor:Colors.LIGHT_GRAY,
            borderRadius:10
          }}
          />
          <Text style={{
            fontSize:20,
            fontWeight:'bold'
          }}>{item.name}</Text>
        </TouchableOpacity>
      )}
      />
    </View>
  )
}