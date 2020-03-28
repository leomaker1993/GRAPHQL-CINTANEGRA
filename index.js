
const {GraphQLServer} =require('graphql-yoga');

const typeDefs=`

type Query{
    hello(name: String!):String!
    getUsers:[User]!
    getUser(id:ID!):User!
}

type Mutation{
    createUser(name:String!,age:Int!):User!
    updateUser(id:Int!,name:String!,age:Int!):String!
    deleteUser(id:Int!):String!

}

type User{
    id:Int!
    name:String!
    age:Int!
}
`;

const users=[];

const resolvers ={
    Query:{
        hello:(root,params,context,info) => `Hola ${JSON.stringify(params.name)} `,
        getUsers:(root,params,context,info) =>users,
        getUser:(root,{id},context,info) => users.find(u=> u.id==id),
    },
    Mutation:{
        createUser:(root,{name,age},context,info) =>{
            const user={
                id:users.length +100,
                name,
                age,
            };
            users.push(user);
            return user
        },
        deleteUser:(root,{id},context,info) =>{
            for (var i=0;i<users.length;i++){
                if(users[i].id===id){
                    users.splice(i,1);
                    return `deleted id: ${id}`
                }
            }
            return `not found id: ${id}`
            
        },
        updateUser:(root,{id,name,age},context,info) =>{
            for (var i=0;i<users.length;i++){
                if(users[i].id===id){
                    users[i].name=name;
                    users[i].age=age;
                    return `modified id: ${id} actual name:${name} actual age:${age}`
                }
            }
            return `not found id: ${id}`
            
        }

    },
};

const server =new GraphQLServer({
    typeDefs,
    resolvers,
    context:{
        a:"Leo"
    }
});

server.start(()=>console.log('Servidor arriba puerto 4000!'))