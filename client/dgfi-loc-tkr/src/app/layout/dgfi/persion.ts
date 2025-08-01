export interface person {
  personId?: number;
  crimeId?: number;
  name: string;
  introduction: string;
  type: 'guest' | 'victim' | 'criminal' | 'plaintiff' | 'defendant' | 'sponsor';
  politicalPartyName?: string;
}

export const guest: person = {
  name: '',
  introduction: '',
  type: 'guest'
};
export const victime: person = {
  name: '',
  introduction: '',
  type: 'victim',
  politicalPartyName:''
};
export const criminal: person = {
  name: '',
  introduction: '',
  type: 'criminal',
  politicalPartyName:''
};
export const plaintiff: person = {
  name: '',
  introduction: '',
  type: 'plaintiff',
  politicalPartyName:''
};
export const defendant: person = {
  name: '',
  introduction: '',
  type: 'defendant',
  politicalPartyName:''
};

export const sponsor: person = {
  name: '',
  introduction: '',
  type: 'sponsor',
  politicalPartyName:''
};