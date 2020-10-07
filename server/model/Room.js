class Room {
    constructor(){
        this.list = []
    }
    
    createUser (id,name,room,date){
        let user = {id,name,room,date};
        this.list.push(user)
    }

    getUserById (name){
        const user = this.list.find(user => user.name===name);
        return user
    }

    removeUser (id){
        const index = this.list.findIndex(user=> user.id===id);
        const user = this.list[index];
        this.list.splice(index,1);
        return user;
    }

    getUserByRoom (room){
        return this.list.filter(user => user.room === room);
    }
}
module.exports = Room