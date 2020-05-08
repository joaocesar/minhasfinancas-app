import React from "react";
import Card from "../components/card";
import FormGroup from "../components/form-group";

class Login extends React.Component {

    state = {
        email: '',
        senha: ''
    }

    entrar = () => {
        console.log('Email: ', this.state.email)
        console.log('Senha: ', this.state.senha)
    }
/*
    entrar = () => {
        this.service.autenticar({
            email: this.state.email,
            senha: this.state.senha
        }).then( response => {
            this.context.iniciarSessao(response.data)
            this.props.history.push('/home')
        }).catch( erro => {
            mensagemErro(erro.response.data)
        })
    }

    prepareCadastrar = () => {
        this.props.history.push('/cadastro-usuarios')
    }
*/

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6" style={{postion: 'relative', left: '300px'}}>
                        <div className="bs-docs-section">
                            <Card title="Login">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="bs-componet">
                                            <fieldset>
                                                <FormGroup label="Email: *" htmlFor="exampleInputEmail1">
                                                    <input type="email"
                                                           value={this.state.email}
                                                           onChange={event => this.setState({email: event.target.value})}
                                                           className="form-control"
                                                           id="exampleInputEmail1"
                                                           aria-describedby="emailHelp"
                                                           placeholder="Digite o Email" />
                                                </FormGroup>
                                                <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                                    <input type="password"
                                                           value={this.state.senha}
                                                           onChange={event => this.setState({senha: event.target.value})}
                                                           className="form-control"
                                                           id="exampleInputPassword1"
                                                           placeholder="Password" />
                                                </FormGroup>
                                                <button onClick={this.entrar} className="btn btn-success">Entrar</button>
                                                <button className="btn btn-danger">Cadastrar</button>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Login
