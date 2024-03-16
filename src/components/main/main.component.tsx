import { Quote } from "../quote/quote.component";
import { ButtonGroup } from "baseui/button-group";
import { Button, SIZE, KIND } from "baseui/button";
import { Block } from 'baseui/block';
import { useEffect, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ImBullhorn, ImCopy } from "react-icons/im";
import { HiVolumeOff } from "react-icons/hi";
import { MonoHeadingXXLarge, MonoParagraphLarge } from "baseui/typography";
import { StyledLink } from "baseui/link";
import { getQuoteFromGemini } from "../../services/gemini";
import { QuoteResponse } from "../../types/common";
import { getQuoteFromNinja } from "../../services/ninja";
import { Input } from "baseui/input";
import { addSubscriber, isSubscribedAlready } from "../../services/firebase";

let firstLoad = true;

export const Main = () => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPoweredByGemini, setPoweredByGemini] = useState(false);
    const [email, setEmail] = useState("");
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const promotionText = `\n\nDiscover more such quotes at - ${window.location.origin}`;

    const handleSpeakClick = (text: string) => {

        if (isSpeaking) {
            window.speechSynthesis.cancel();
        } else {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);

            speech.onend = () => {
                setIsSpeaking(false);
            };
        }
        
        setIsSpeaking(!isSpeaking);
    };

    const onCopy = () => {
        setIsCopied(true);
    }

    const fetchNewQuote = async () => {
      setIsLoading(true);

      let data: QuoteResponse = { quote: '', author: ''};

      if (Math.random() < 0.5) {
        setPoweredByGemini(false);
        data = await getQuoteFromNinja();
      } else {
        data = await getQuoteFromGemini();
        setPoweredByGemini(true);
      }

      setQuote(data.quote);
      setAuthor(data.author);

      setIsCopied(false);
      setIsLoading(false);
    }

    const validateEmail = (_email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(_email);
    }

    const handleSubscription = async () => {
        if (!validateEmail(email)) {
            setIsEmailValid(false);
            return;
        }

        setIsEmailValid(true);

        setIsButtonLoading(true);

        if (await isSubscribedAlready(email)) {
            localStorage.setItem('isSubscribed', 'true');
            setIsSubscribed(true);
            setIsButtonLoading(false);
            return;
        }

        await addSubscriber(email).then(() => {
            setEmail('');
            localStorage.setItem('isSubscribed', 'true');
            setIsSubscribed(true);
        });

        setIsButtonLoading(false);
    }

    useEffect(() => {
      if (firstLoad) {
          firstLoad = false;
          fetchNewQuote();
      }

      const _isSubscribed = localStorage.getItem('isSubscribed');

      if (_isSubscribed === 'true') {
        setIsSubscribed(true);
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: '5% 10% 5% 10%'}}>
            <Block style={{ display: 'block', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <MonoHeadingXXLarge>QuoteQuest</MonoHeadingXXLarge>
                <MonoParagraphLarge style={{ marginTop: '-1%'}}>Discover-Wisdom-at-Your-Fingertips</MonoParagraphLarge>
            </Block>
            <Block style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Quote text={quote} author={author} />
            </Block>
            <Block style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px' }}>
                <ButtonGroup>
                    {('speechSynthesis' in window) ? <Button 
                    startEnhancer={() => isSpeaking ? <HiVolumeOff /> : <ImBullhorn /> }
                    style={{ marginRight: '10px' }}
                    disabled={isLoading}
                    onClick={() => handleSpeakClick(quote)}>{ isSpeaking ? 'Silence' : 'Speak' }</Button> : <></>}
                    <Button
                        disabled={isSpeaking}
                        style={{ marginRight: '10px'}}
                        overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                backgroundColor: $theme.colors.black,
                                color: $theme.colors.white,
                                ':hover': {
                                    backgroundColor: $theme.colors.black
                                }
                              })
                            }
                          }}
                        kind={KIND.primary}
                        onClick={fetchNewQuote}
                        size={SIZE.compact}
                        isLoading={isLoading}
                    >Next Quote</Button>
                    <CopyToClipboard onCopy={onCopy} text={`'${quote}' ~${author}` + promotionText}>
                    <Button
                        startEnhancer={() => <ImCopy />}
                        kind={KIND.secondary}
                    >{isCopied ? 'Copied!' : 'Copy'}</Button>
                    </CopyToClipboard>
                </ButtonGroup>
            </Block>
            <Block style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              {isPoweredByGemini ? <u>Powered By Gemini</u>: ''}
            </Block>
            <Block style={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }}>
                <Block>
                    <StyledLink target="blank" href="https://github.com/visakhvjn/random-quotes" style={{ textDecoration: 'none', color: 'grey' }}>
                        Github
                    </StyledLink>
                </Block>
                <Block>&nbsp;|&nbsp;</Block>
                <Block>
                    <StyledLink target="blank" href="https://twitter.com/vjnvisakh"  style={{ textDecoration: 'none', color: 'grey'}}>
                        Twitter
                    </StyledLink>
                </Block>
            </Block>
            <br />
            <Block style={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column', position: 'fixed',
                bottom: 0, backgroundColor: 'lightgray',
                width: '100%', left: 0,
                padding: '2%'
            }}>
                <Block>Receive wisdom in your inbox daily</Block>
                <br />
                <Block style={{ display: 'flex', flexDirection: 'row', gap: '2%', width: '30%' }}>
                    <Input 
                        disabled={isSubscribed}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        clearOnEscape
                        clearable
                        error={!isEmailValid}
                    />
                    <Button
                        isLoading={isButtonLoading}
                        onClick={handleSubscription}
                        disabled={isSubscribed}
                    >
                        Subscribe
                    </Button>
                </Block>
                <br />
                <Block>{isSubscribed && <>You are subscribed!</>}</Block>
            </Block>
        </div>
    );
};  