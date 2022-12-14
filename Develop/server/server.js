const express = require('express');
const path = require('path');

const{ApolloServer}=require('apollo-server-express');
const{typeDefs,resolvers}=require('./schemas')
const{authMiddleware}=require('./utils/auth');

const db = require('./config/connection');
const routes = require('./routes');

//apollo server
const server=new ApolloServer({
  typeDefs,
  resolvers,
  context:authMiddleware
});
//apollo server with express
server.applyMiddleware({app});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

app.get('*',(req,res)=>{
  res.sendfile(path.join(__dirname, '../client/build/index.html'));
})

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log('use graphql at http://localhost:${PORT}${server.graphqlPath}');
});
