package com.onestopcodig.angularbackend.enumerations;

public enum Type {
    OTHER("other"),MAIL_SERVER("mail"), WEB_SERVER("web"), FILE_SERVER("file"), DATABASE_SERVER("database");
    private final String type;

    Type(String type) {
        this.type = type;
    }
}
