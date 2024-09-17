create database if not exists quiz;

create table if not exists users(
    id int not null,
    email varchar(256) not null,
    password varchar(1024) not null,
 primary key(id)
)