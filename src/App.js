import React, { Component } from 'react'
import { nanoid } from 'nanoid'
import { Button, Input, Form } from 'reactstrap'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'
import 'bootstrap/dist/css/bootstrap.css'

import './App.css'
import WarningAlert from './WarningAlert'
import SuccessAlert from './SuccessAlert'

const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker()
  console.log()
  return (
    promiseInProgress && <h3>loading...</h3>
  )
}

async function getAdjective () {
  const nouns = ['ocean&topics=size', 'sky&topics=size', 'goose', 'ant&topics=size', 'city', 'plant']
  return await fetch(`https://api.datamuse.com/words?rel_jjb=${nouns[Math.floor(Math.random() * nouns.length)]}`, {
    method: 'GET'
  }).then(res => res.json()).then(data => {
    const word = data[Math.floor(Math.random() * data.length)].word
    return word
  })
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alias: '',
      url: '',
      placeHolder: null,
      validURL: false,
      result: null,
      response: null,
      display: null
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (event) {
    this.setState({ display: null })
    const target = event.target
    const url = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi
    if (target.name === 'url') {
      const matches = target.value.match(url)
      this.setState({
        validURL: matches && matches.length > 0
      })
    }
    this.setState({
      [target.name]: target.value.replace(/ /g, '_')
    })
  }

  async handleSubmit (event) {
    event.preventDefault()
    const response = await this.postUrl(this.state.alias ? this.state.alias : this.state.placeHolder, this.state.url)
    const body = await response.json()
    this.setState({ result: body, response })
    this.setState({ display: this.displayCode() })
  }

  async postUrl (alias, url) {
    return await trackPromise(fetch('/.netlify/functions/server/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8', Accept: 'application/json' },
      body: JSON.stringify({ alias, url })
    }))
  }

  displayCode () {
    if (this.state.result != null) {
      if (this.state.response.ok) {
        const link = `http://honk.gq/${this.state.result.alias}`
        return <SuccessAlert url={link}/>
      } else {
        return <WarningAlert/>
        // return <p className="report text-center">{'⛔️ This alias is already in use! 😭'}</p>
      }
    }
    return ''
  }

  async setHint () {
    if (this.state.placeHolder == null) {
      const adjective = await getAdjective()
      this.setState({ placeHolder: adjective ? `my-${adjective}-link` : nanoid(7) })
    }
  }

  render () {
    this.setHint()
    return (
      <div className="container-fluid m-0 p-0 row align-items-center justify-content-center" style={{ height: '90vh' }}>
        <div className="d-flex flex-column px-0 col my-auto">
          <header>
            <h1 className="d-flex justify-content-center">honk!</h1>
          </header>
          <section>
            <div className="d-flex justify-content-center">
              <div className="d-flex col-xs-11 col-sm-9 col-lg-5 flex-column justify-content-center">
                <Form className="d-flex flex-column justify-content-center mb-4">
                  <label>Redirect URL
                    <Input id="url" name="url" placeholder="url" value={this.state.url} onChange={event => this.handleInputChange(event)}></Input>
                    <small className="form-text text-muted">This is where your Honk will redirect you.</small>
                  </label>
                  <label>Alias
                    <Input id="alias" name="alias" placeholder={this.state.placeHolder} value={this.state.alias} onChange={event => this.handleInputChange(event)}></Input>
                    <small className="form-text text-muted">Your Honk will live at https://honk.gq/<strong>{this.state.alias ? this.state.alias : this.state.placeHolder}</strong></small>
                  </label>
                  <label className="text-center">
                    <Button className="submit px-3 pt-2 mt-sm-2 mt-md-3" type="submit" disabled={!this.state.validURL} onClick={event => this.handleSubmit(event)} onSubmit={event => this.handleSubmit(event)}>Create my Honk!</Button>
                  </label>
                </Form>
                {this.state.display}
                <LoadingIndicator/>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default App
