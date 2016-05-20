"use strict"

import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import {Overlay} from '../Overlay'
import PubSub from 'pubsub-js'

const CALLBACK_MESSAGE = "CALLBACK_MESSAGE"
const ADD_MESSAGE = "EB3A79637B40"
const REMOVE_MESSAGE = "73D4EF15DF50"
const CLEAR_MESSAGE = "73D4EF15DF52"
let messages = []
let messageContainer = null

class Item extends React.Component {
  static displayName = 'Message.Item'

  static propTypes = {
    className: React.PropTypes.string,
    content: React.PropTypes.any,
    dismissed: React.PropTypes.bool,
    index: React.PropTypes.number,
    onDismiss: React.PropTypes.func,
    type: React.PropTypes.string
  }

  dismiss () {
    if (this.props.dismissed) {
      return
    }
    this.props.onDismiss(this.props.index)
  }

  render () {
    let className = classnames(
      this.props.className,
      'cmpt-message',
      `cmpt-message-${this.props.type}`,
      { 'dismissed': this.props.dismissed }
    )

    return (
      <div className={className}>
        <button type="button" onClick={this.dismiss.bind(this)} className="close">&times;</button>
        {this.props.content}
      </div>
    )
  }
}

export default class Message extends React.Component {
  static displayName = 'Message'

  static propTypes = {
    className: React.PropTypes.string,
    messages: React.PropTypes.array
  }

  static show (content, type, cb) {
    if (!messageContainer) {
      createContainer()
    }

    PubSub.publish(ADD_MESSAGE, {
      content: content,
      type: type || 'info'
    })

    if(typeof cb === "function"){
      PubSub.publish(CALLBACK_MESSAGE, cb, {
        content: content,
        type: type || 'info'
      })
    }
  }

  static success(content, cb) {
    Message.show(content, "success", cb)
  }

  static error(content, cb) {
    Message.show(content, "error", cb)
  }

  static warning(content, cb) {
    Message.show(content, "warning", cb)
  }

  dismiss (index) {
    PubSub.publish(REMOVE_MESSAGE, index)
  }

  clear () {
    PubSub.publish(CLEAR_MESSAGE)
  }

  render () {
    let items = this.props.messages.map((msg, i) => {
      return (
        <Item key={i} index={i} ref={i} onDismiss={this.dismiss} {...msg} />
      )
    })

    let className = classnames(
      this.props.className,
      'cmpt-message-container',
      { 'has-message': this.props.messages.length > 0 }
    )

    return (
      <div className={className}>
        <Overlay onClick={this.clear.bind(this)} />
        {items}
      </div>
    )
  }
}

function renderContainer() {
  ReactDOM.render(<Message messages={messages} />, messageContainer)
}

function createContainer () {
  messageContainer = document.createElement('div')
  document.body.appendChild(messageContainer)
}

PubSub.subscribe(CALLBACK_MESSAGE, (topic, cb, data) => {
  if(typeof cb === "function") {
    cb(topic, data);
  }
})

PubSub.subscribe(ADD_MESSAGE, (topic, data) => {
  messages = [...messages, data]
  renderContainer()
})

PubSub.subscribe(REMOVE_MESSAGE, (topic, index) => {
  messages = [
    ...messages.slice(0, index),
    ...messages.slice(index + 1)
  ]
  renderContainer()
})

PubSub.subscribe(CLEAR_MESSAGE, () => {
  messages = messages.map((m) => {
    m.dismissed = true
    return m
  })
  renderContainer()
  setTimeout(() => {
    messages = []
    renderContainer()
  }, 400)
})
