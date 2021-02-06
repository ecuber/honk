import React, { useState } from 'react'
import { Alert } from 'reactstrap'
import PropTypes from 'prop-types'

const SuccessAlert = (props) => {
  const [visible, setVisible] = useState(true)

  const onDismiss = () => setVisible(false)

  return (
    <Alert color="success" isOpen={visible} toggle={onDismiss}>
      <h5 className="alert-heading m-0 text-center">
        Successfully created URL!
      </h5>
      <p className="text-center m-0">
        <span className="unselectable" role="img" aria-label="sparkle">✨</span>
        <a href={props.url}>
          {props.url}
        </a>
        <span className="unselectable" role="img" aria-label="sparkle"> ✨</span>
      </p>
    </Alert>
  )
}

SuccessAlert.propTypes = {
  url: PropTypes.string
}

export default SuccessAlert
