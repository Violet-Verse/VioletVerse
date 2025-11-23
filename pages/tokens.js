import React, { useState } from 'react'
import { Box, Button, Grid, TextField } from '@mui/material'
import { useFlowContext } from '../components/Context/flowContext'
import { useUser } from '../hooks/useAuth'
import { createVault } from '../cadence/scripts/transactions/createVault'
import { transferTokens } from '../cadence/scripts/transactions/transferTokens'

import * as fcl from '@blocto/fcl'
import * as types from '@onflow/types'
import Router from 'next/router'
import { useForm } from 'react-hook-form'

import { ScaleLoader } from 'react-spinners'

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
      userTypes: ['admin', 'contributor', 'user'],
    },
  }
}

const Tokens = () => {
  const { user, loaded } = useUser()
  const vvTokens = useFlowContext()
  const [walletLoading, setWalletLoading] = useState(false)
  const [txPending, setTxPending] = useState(false)
  const [txComplete, setTxComplete] = useState(false)
  const [txStatus, setTxStatus] = useState()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async ({ address, tokenAmount }) => {
    global.analytics.track('Send Tokens Initiated', {
      address: address,
      token_amount: tokenAmount.toFixed(5).toString(),
    })
    try {
      setTxPending(true)
      const transactionId = await fcl.mutate({
        cadence: transferTokens,
        args: (arg, t) => [
          arg(address, types.Address),
          arg(tokenAmount.toFixed(5).toString(), types.UFix64),
        ],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 1000,
      })

      await fcl
        .tx(transactionId)
        .onceSealed()
        .then((tx) => {
          global.analytics.track('Send Tokens Successful', {
            address: address,
            token_amount: tokenAmount.toFixed(5).toString(),
            tx_url: `https://flowscan.org/transaction/${tx.events[0].transactionId}`,
          })
          setTxComplete(true)
          setTxPending(false)
          setTxStatus({
            message: `https://flowscan.org/transaction/${tx.events[0].transactionId}`,
            status: 'success',
          })
        })
        .catch((err) => {
          setTxStatus({ message: err, status: 'error' })
          setTxComplete(true)
          setTxPending(false)
        })
    } catch (err) {
      setTxStatus({ message: err, status: 'error' })
      setTxComplete(true)
      setTxPending(false)
      global.analytics.track('Send Tokens Cancelled', {
        address: address,
        token_amount: tokenAmount.toFixed(5).toString(),
        error_message: 'Transaction Cancelled',
      })
    }
  }

  const setupWallet = async () => {
    try {
      setWalletLoading(true)
      const transactionId = await fcl.mutate({
        cadence: createVault,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 1000,
      })

      await fcl
        .tx(transactionId)
        .onceSealed()
        .then(() => {
          setWalletLoading(false)
          Router.reload(window.location.pathname)
        })
    } catch (err) {
      console.log(err)
      setWalletLoading(false)
    }
  }

  return (
    <Box
      sx={{
        px: {
          xs: '0',
          sm: '5%',
          md: '10%',
          lg: '15%',
          xl: '20%',
        },
      }}
    >
      {loaded && vvTokens ? (
        <>
          <Grid
            container
            justifyContent="center"
            alignContent="center"
            direction="column"
            align="center"
            spacing={3}
          >
            <Grid item>
              <h1>Violet Verse Tokens</h1>
            </Grid>
            <Grid item>
              <h4>$VV Balance</h4>
              <TextField
                // label="Your Balance"
                fullWidth
                defaultValue={parseFloat(vvTokens).toLocaleString('en-US')}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                color="secondary"
              />
            </Grid>
            <Grid item>
              <h4>Flow Address</h4>
              <TextField
                // label="Your Address"
                fullWidth
                defaultValue={user.flowAddress}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                color="secondary"
              />
            </Grid>
          </Grid>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              justifyContent="center"
              alignContent="center"
              direction="column"
              sx={{ mt: 4 }}
            >
              <Box
                sx={{
                  borderRadius: 10,
                  py: 5,
                  px: 7,
                  color: 'gray',
                  transition: '0.2s',
                  boxShadow: 'rgba(105, 62, 154, 0.2) 0px 2px 8px 0.2px',
                  '&:hover': {
                    boxShadow: 'rgba(105, 62, 154, 0.5) 0px 2px 8px 0.2px',
                  },
                }}
              >
                <Grid item>
                  <Box
                    sx={{
                      pb: 1,
                      boxShadow: 'rgba(105, 62, 154, 0.5) 0px 2px 0px 0px',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      VIOLET VERSE | $VV
                    </h4>
                  </Box>
                </Grid>
                {!txComplete ? (
                  <>
                    <Grid item sx={{ mt: 2 }}>
                      <h4>{txPending ? 'Confirming Transaction...' : 'Send Tokens'}</h4>
                    </Grid>
                    {!txPending ? (
                      <>
                        <Grid item sx={{ mt: 2 }}>
                          <TextField
                            variant="standard"
                            color="secondary"
                            label={vvTokens == 0 ? 'Not Enough Tokens' : 'Amount'}
                            fullWidth
                            type="number"
                            disabled={txPending || vvTokens == 0}
                            inputProps={{
                              min: 0.0001,
                              step: 0.0001,
                              max: vvTokens,
                            }}
                            error={!!errors?.tokenAmount}
                            helperText={
                              errors?.tokenAmount ? errors.tokenAmount.message : null
                            }
                            {...register('tokenAmount', {
                              required: 'Required',
                              valueAsNumber: true,
                              validate: (value) => value > 0,
                              pattern: {
                                value: /^(0|[1-9]\d*)(\.\d+)?$/,
                                message: 'Only numbers',
                              },
                            })}
                          />
                        </Grid>

                        <Grid item sx={{ mt: 2 }}>
                          <TextField
                            variant="standard"
                            color="secondary"
                            label="Flow Address"
                            fullWidth
                            disabled={txPending || vvTokens == 0}
                            error={!!errors?.address}
                            helperText={errors?.address ? errors.address.message : null}
                            {...register('address', {
                              required: 'Required',
                              pattern: {
                                value: /0x[a-fA-F0-9]{16}/g,
                                message: 'Invalid address (0x...1234)',
                              },
                            })}
                          />
                        </Grid>
                      </>
                    ) : (
                      <Grid item align="center" sx={{ py: 4.5, px: 5 }}>
                        <ScaleLoader color="#693E9A" height={60} width={15} radius={4} />
                      </Grid>
                    )}
                    <Grid item sx={{ mt: 3 }}>
                      <Box sx={{ position: 'relative' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disableElevation
                          disabled={txPending || vvTokens == 0}
                          sx={{
                            backgroundColor: '#693E9A',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#815AAD',
                            },
                          }}
                        >
                          Send Tokens
                        </Button>
                      </Box>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item sx={{ mt: 2 }}>
                      <h4>Transaction Status</h4>
                    </Grid>
                    {txStatus.status == 'error' ? (
                      <Grid item sx={{ mt: 2 }}>
                        <h5
                          style={{
                            inlineSize: '250px',
                            overflowWrap: 'break-word',
                          }}
                        >
                          {txStatus.message[0] || 'Transaction Cancelled'}
                        </h5>
                      </Grid>
                    ) : (
                      <>
                        <Grid item sx={{ mt: 2 }}>
                          <h5>Successful Transaction</h5>
                        </Grid>
                        <Grid item sx={{ mt: 2 }}>
                          <a href={txStatus.message} target="_blank" rel="noreferrer">
                            <h5
                              style={{
                                color: 'purple',
                              }}
                            >
                              View Transaction
                            </h5>
                          </a>
                        </Grid>
                      </>
                    )}
                    <Grid item sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        disableElevation
                        onClick={() => setTxComplete(false)}
                        sx={{
                          backgroundColor: '#693E9A',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#815AAD',
                          },
                        }}
                      >
                        Go Back
                      </Button>
                    </Grid>
                  </>
                )}
              </Box>
            </Grid>
          </form>
        </>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          direction="column"
          align="center"
          spacing={3}
        >
          <Grid item>
            <h1>Violet Verse Tokens</h1>
          </Grid>
          <Grid item>
            {!walletLoading ? (
              <Button variant="contained" disableElevation onClick={() => setupWallet()}>
                Create Your VV Wallet
              </Button>
            ) : (
              <Button variant="contained" disableElevation disabled>
                Generating New Wallet...
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default Tokens
