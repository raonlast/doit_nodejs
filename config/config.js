module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/local',
    db_schemas: [
        {file: './user_schema',
         collection:'facebookLogin',
         schemaName:'userSchema',
         modelName:'userModel'}
    ],

    route_info: [
        
    ],
    facebook: {
        clientID: '357319745447615',
        clientSecret: '1dd13606ff50b1cd2d19f7f58344aca6',
        callbackURL: '/auth/facebook/callback'
    }
    
}