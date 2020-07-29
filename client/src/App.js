import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import { Button, Input, Form } from 'reactstrap'


class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alias: '',
      url: '',
      validURL: false,
      result: null,
      response: null,
      display: null
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const url = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi
    if (target.name === 'url') {
      const matches = target.value.match(url)
      this.setState({
        validURL: matches && matches.length > 0
      })
    }
    this.setState({
      [target.name]: target.value
    })
  }

  async handleSubmit (event) {
    event.preventDefault();
    const response = await this.postUrl(this.state.alias, this.state.url)
    const body = await response.json()
    this.setState({ result: body, response })
    if (response.ok) {
      this.setState({ display: this.displayCode() })
    }
  }

  async postUrl (alias, url) {
    return await fetch('/create', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Accept' : 'application/json' },
      body: JSON.stringify({ alias, url })})
  }

  displayCode () {
    if (this.state.result != null) {
        if (this.state.response.ok) {
          console.log(this.state)
          const link = `http://honk.gq/${this.state.result.alias}`
          return (<p>{'✅ Successfully created '}<a href={link}>{link}</a></p>)
        } else {
          return `⛔️ Something went wrong...`
        }
    }
    return ''
  }

  render = () => {
    return (
      <div className="App">
        <header>
          <h1>honk!</h1>
          <Form>
            <label>URL:
              <Input id="url" name="url" placeholder="url" value={this.state.url} onChange={event => this.handleInputChange(event)}></Input>
            </label>
            <label>Alias:
              <Input id="alias" name="alias" placeholder="alias" value={this.state.alias} onChange={event => this.handleInputChange(event)}></Input>
            </label>
            <label>
            <Button type="submit" disabled={!this.state.validURL} onClick={event => this.handleSubmit(event)} onSubmit={event => this.handleSubmit(event)}>Create short url</Button>
            </label>
          </Form>
          {this.state.display}
        </header>
      </div>
    );
  }
}

export default App;
