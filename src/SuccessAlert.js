import React, { useState } from 'react'
import { Alert } from 'reactstrap'
import PropTypes from 'prop-types'

const SuccessAlert = (props) => {
  const [visible, setVisible] = useState(true)

  const onDismiss = () => setVisible(false)

  return (
    <Alert color="success" isOpen={visible} toggle={onDismiss}>
      <h5 className="alert-heading mb-0 text-center">
        Successfully created URL!
      </h5>
      <p className="text-center mb-0">
        <a href={props.url}>
          <span role="img" aria-label="sparkle">✨</span>
          {props.url}
          <span role="img" aria-label="sparkle">✨</span>
        </a>
      </p>
    </Alert>
  )
}

SuccessAlert.propTypes = {
  url: PropTypes.string
}

export default SuccessAlert
