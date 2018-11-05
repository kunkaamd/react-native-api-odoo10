import React, {Component} from "react";
import {Image, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Odoo from './odoo'
export default class Component extends Component {
    onClickCheckIn() {
        var Odoo = new Odoo({
            host: '10.0.2.2',//emular -> localhost:8069
            port: '8069',
            database: 'erp',
            username: 'admin',
            password: 'admin'
        });
        this.props.odooSession.connect((err) =>  {
            if (err) {
                return console.log(err);
            }
            this.props.odooSession.call('integrate.api', 'receive_attendance_manual', 'hello world', (err, response) => {
                if (err) {
                    return console.log(err);
                }
                console.log('result: ', response);
            });
        });
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.onClickCheckIn();
            }}>
        );
    }
}