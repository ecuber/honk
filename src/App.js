import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import { Button, Input, Form } from 'reactstrap'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'

const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker()
  console.log()
  return (
    promiseInProgress && <h3>loading...</h3>
  )
}

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
      [target.name]: target.value
    })
  }

  async handleSubmit (event) {
    event.preventDefault()
    const response = await this.postUrl(this.state.alias, this.state.url)
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
        console.log(this.state)
        const link = `http://honk.gq/${this.state.result.alias}`
        return (<p className="report d-flex justify-content-center">{'✅ Successfully created url! ✨'} <a href={link}> {link}</a> {'✨'}</p>)
      } else {
        return <p className="report d-flex justify-content-center">{'⛔️ This alias is already in use! 😭'}</p>
      }
    }
    return ''
  }

  render () {
    return (
      <div className="App d-flex flex-column">
        <header>
          <h1 className="mt-4 d-flex justify-content-center">honk!</h1>
        </header>
        <section>
          <div className="d-flex justify-content-center">
            <div className="d-flex col-5 flex-column justify-content-center">
              <Form className="d-flex flex-column justify-content-center mb-4">
                <label>URL:
                  <Input id="url" name="url" placeholder="url" value={this.state.url} onChange={event => this.handleInputChange(event)}></Input>
                </label>
                <label>Alias:
                  <Input id="alias" name="alias" placeholder="alias" value={this.state.alias} onChange={event => this.handleInputChange(event)}></Input>
                </label>
                <label>
                  <Button className="submit" type="submit" disabled={!this.state.validURL} onClick={event => this.handleSubmit(event)} onSubmit={event => this.handleSubmit(event)}>Create short url</Button>
                </label>
              </Form>
              {this.state.display}
              <LoadingIndicator/>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default App
