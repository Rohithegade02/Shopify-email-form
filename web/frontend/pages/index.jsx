import React, { useState } from "react";
// import { Form, TextField, Button, Page, FormLayout } from "@shopify/polaris";
// import { useForm } from "@shopify/react-form";
import {
  useField,
  useForm,
  notEmpty,
  lengthMoreThan,
} from "@shopify/react-form";
import {
  Page,
  Layout,
  FormLayout,
  Form,
  Card,
  TextField,
  ContextualSaveBar,
  Frame,
  Banner,
  AlphaCard,
} from "@shopify/polaris";
import axios from "axios";
import { useAuthenticatedFetch } from "../hooks";
export default function HomePage() {
  const fetch = useAuthenticatedFetch();
  const { fields, submit, submitting, dirty, reset, submitErrors, makeClean } =
    useForm({
      fields: {
        email: useField({
          value: "",
          validates: [
            notEmpty("email is required"),
            (email) => {
              if (!email.includes("@")) {
                return "Email format is required";
              }
            },
          ],
        }),
      },

      async onSubmit(fields) {
        const uri = "http://localhost:56495/api/submitForm";
        let platform = "shopify";
      
        const auth_token = "cljoj3trv0000356g1r2gja85";
        
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          
            'Authorization': `Bearer ${auth_token}`, // Include the authorization header
          },
          body: JSON.stringify({
            email: fields.email,
          }),
        };
        try {
          const res = await fetch(uri, options);
          console.log(res);
          if (!res.ok) {
            throw new Error("Failed to submit form");
          }

          const data = await res.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
    });

  //console.log(fields.description.value, fields.email.value);
  const contextBar = dirty ? (
    <ContextualSaveBar
      message='Unsaved Form'
      saveAction={{
        onAction: submit,
        loading: submitting,
        disabled: false,
      }}
      discardAction={{
        onAction: reset,
      }}
    />
  ) : null;

  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section>
        <Banner status='critical'>
          <p>There were some issues with your form submission:</p>
          <ul>
            {submitErrors.map(({ message }, index) => {
              return <li key={`${message}${index}`}>{message}</li>;
            })}
          </ul>
        </Banner>
      </Layout.Section>
    ) : null;

  return (
    <Frame>
      <Form
        onSubmit={submit}
        preventDefault={true}
        title='Registration'
        method='POST'
      >
        <Page title='New Product'>
          {contextBar}
          <Layout>
            {errorBanner}
            <Layout.Section>
              <AlphaCard sectioned>
                <FormLayout>
                  <TextField label='Email' {...fields.email} />
                </FormLayout>
              </AlphaCard>
            </Layout.Section>
          </Layout>
        </Page>
      </Form>
    </Frame>
  );
}
