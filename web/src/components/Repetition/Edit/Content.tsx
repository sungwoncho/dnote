import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import services from 'web/libs/services';
import { BookDomain, RepetitionRuleData } from 'jslib/operations/types';
import { booksToOptions } from 'jslib/helpers/select';
import { getRepetitionsPath, repetitionsPathDef } from 'web/libs/paths';
import Form, { FormState } from '../Form';
import { useDispatch } from '../../../store';
import { setMessage } from '../../../store/ui';

interface Props extends RouteComponentProps {
  setErrMsg: (string) => void;
  data: RepetitionRuleData;
}

const RepetitionEditContent: React.SFC<Props> = ({
  history,
  setErrMsg,
  data
}) => {
  const dispatch = useDispatch();

  async function handleSubmit(state: FormState) {
    let bookUUIDs = [];
    if (state.bookDomain === BookDomain.All) {
      bookUUIDs = [];
    } else {
      bookUUIDs = state.books.map(b => {
        return b.value;
      });
    }

    try {
      await services.repetitionRules.update(data.uuid, {});

      const dest = getRepetitionsPath();
      history.push(dest);

      dispatch(
        setMessage({
          message: `Updated the repetition rule: "${data.title}"`,
          kind: 'info',
          path: repetitionsPathDef
        })
      );
    } catch (e) {
      console.log(e);
      setErrMsg(e.message);
    }
  }

  const initialFormState = {
    title: data.title,
    enabled: data.enabled,
    hour: data.hour,
    minute: data.minute,
    frequency: data.frequency,
    noteCount: data.noteCount,
    bookDomain: data.bookDomain,
    books: booksToOptions(data.books)
  };

  return (
    <Form
      onSubmit={handleSubmit}
      setErrMsg={setErrMsg}
      initialState={initialFormState}
    />
  );
};

export default withRouter(RepetitionEditContent);