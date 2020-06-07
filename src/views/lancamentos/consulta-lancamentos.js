import React from "react";
import {withRouter} from "react-router-dom";

import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import LancamentosTable from "./lancamentosTable";
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localStorageService";

import * as messages from "../../components/toastr";

import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";

class ConsultaLancamentos extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfimDialog: false,
        lancamentoExcluir: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {

        if (!this.state.ano) {
            messages.mensagemErro("O campo Ano é obrigatório!")
            return false;
        }
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then(resposta => {
                const lista = resposta.data;
                if (lista.length < 1) {
                    messages.mensagemAlerta("Nenhum lançamento encontrado!")
                }
                this.setState({lancamentos: lista})
            }).catch(error => {
                console.log(error)
            });
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmacao = (lancamento) => {
        console.log('Abrir Confirmação...', lancamento)
        this.setState({showConfirmeDialog: true, lancamentoExcluir: lancamento});
    }

    cancelarExclusao = () => {
        console.log('Cancelar Exclusão...')
        this.setState({showConfirmeDialog: false, lancamentoExcluir: {}});
    }

    excluir = () => {
        console.log('Excluir...')
        this.service
            .excluir(this.state.lancamentoExcluir.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoExcluir);
                lancamentos.splice(index, 1);
                this.setState({lancamentos: lancamentos, showConfirmDialog: false});
                messages.mensagemSucesso("Lancamento excluido com sucesso!")
            }).catch(error => {
                messages.mensagemErro("Ocorreu um erro ao excluir o lancçamento!")
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if (index !== -1) {
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento;
                    this.setState({lancamento});
                }
                messages.mensagemSucesso("Status atualizado com sucesso!")
            })
    }

    render() {
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obiterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.excluir} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarExclusao} className="p-button-secondary"/>
            </div>
        );

        return (
            <Card title="Consulta Lancamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input type="text"
                                       className="form-control"
                                       id="inputAno"
                                       value={this.state.ano}
                                       onChange={event => this.setState({ano: event.target.value})}
                                       placeholder="Digite o ano"/>
                            </FormGroup>
                            <FormGroup htmlFor="inputMes" label="Mes: ">
                                <SelectMenu id="inputMes"
                                            value={this.state.mes}
                                            onChange={event => this.setState({mes: event.target.value})}
                                            className="form-control"
                                            lista={meses}/>
                            </FormGroup>
                            <FormGroup htmlFor="inputDescricao" label="Descrição: ">
                                <input type="text"
                                       className="form-control"
                                       id="inputDescricao"
                                       value={this.state.descricao}
                                       onChange={event => this.setState({descricao: event.target.value})}
                                       placeholder="Digite a descrição"/>
                            </FormGroup>
                            <FormGroup htmlFor="inputTipo" label="Tipo: ">
                                <SelectMenu id="inputTipo"
                                            value={this.state.tipo}
                                            onChange={event => this.setState({tipo: event.target.value})}
                                            className="form-control" lista={tipos}/>
                            </FormGroup>

                            <button onClick={this.buscar}
                                    type="button"
                                    className="btn btn-success">
                                <i className="pi pi-search"></i> Buscar
                            </button>
                            <button onClick={this.preparaFormularioCadastro}
                                    type="button"
                                    className="btn btn-danger">
                                <i className="pi pi-plus"></i> Cadastrar
                            </button>

                        </div>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos}
                                                editarAction={this.editar}
                                                excluirAction={this.abrirConfirmacao}
                                                alterarStatus={this.alterarStatus}/>
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmação"
                            visible={this.state.showConfimDialog}
                            style={{width: '50vw'}}
                            footer={confirmDialogFooter}
                            modal={true}
                            onHide={() => this.setState({showConfimDialog: false})}>
                        Confirma a exclusão desse lançamento?
                    </Dialog>
                </div>
            </Card>
        );
    }

}

export default withRouter(ConsultaLancamentos)
